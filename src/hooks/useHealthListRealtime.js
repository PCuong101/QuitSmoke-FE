// src/hooks/useHealthListRealtime.js (PHIÊN BẢN ĐÃ SỬA LỖI)

import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext";

function useHealthList() {
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useUser();

  // 📦 Gọi API khi userId thay đổi (đây là thay đổi quan trọng nhất)
  useEffect(() => {
    // Nếu không có userId (ví dụ: vừa logout), dọn dẹp state và dừng lại
    if (!userId) {
      setHealthList([]);
      setLoading(false);
      return;
    }
    
    setLoading(true); // Bắt đầu loading khi có userId mới
    axios
      .get(`http://localhost:8080/api/health-milestones/progress/${userId}`)
      .then((res) => {
        const list = res.data.map((item) => ({
          ...item,
          timeRemaining: calculateRemaining(item.recoveryEndTime),
        }));
        setHealthList(list);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API health-milestones:", err);
        setHealthList([]); // Nếu lỗi, cũng dọn dẹp dữ liệu
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]); // <-- SỬA Ở ĐÂY: Thêm [userId] để hook chạy lại khi user thay đổi

  // ⏱ Tự trừ timeRemaining mỗi giây
  useEffect(() => {
    // Nếu không có dữ liệu, không chạy bộ đếm
    if (healthList.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setHealthList((prev) =>
        prev.map((item) => ({
          ...item,
          // Chỉ cần trừ 1 giây từ giá trị hiện tại, không cần tính lại từ đầu
          timeRemaining: Math.max(0, item.timeRemaining - 1), 
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [healthList]); // <-- CẢI TIẾN: Chạy lại interval khi healthList thay đổi

  return { healthList, loading };
}

// 👉 Hàm tính số giây còn lại đến recoveryEndTime (giữ nguyên)
function calculateRemaining(recoveryEndTime) {
  if (!recoveryEndTime) return 0;
  const end = dayjs(recoveryEndTime);
  const now = dayjs();
  if (!end.isValid()) return 0;
  return Math.max(0, end.diff(now, "second"));
}

export default useHealthList;