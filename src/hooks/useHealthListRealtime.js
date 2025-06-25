import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext";

function useHealthList() {
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useUser();
  // 📦 Gọi API khi component mount
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/health-milestones/progress/${userId}`)
      .then((res) => {
        const list = res.data.map((item) => ({
          ...item,
          timeRemaining: calculateRemaining(item.recoveryEndTime),
        }));
        setHealthList(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API:", err);
        setLoading(false);
      });
  }, []);

  // ⏱ Tự trừ timeRemaining mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthList((prev) =>
        prev.map((item) => ({
          ...item,
          timeRemaining: Math.max(0, calculateRemaining(item.recoveryEndTime)),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { healthList, loading };
}

// 👉 Hàm tính số giây còn lại đến recoveryEndTime
function calculateRemaining(recoveryEndTime) {
  if (!recoveryEndTime) return 0;
  const end = dayjs(recoveryEndTime); // "2025-06-25T18:45:00"
  const now = dayjs();
  if (!end.isValid()) return 0;

  return Math.max(0, end.diff(now, "second")); // trả về số giây
}

export default useHealthList;
