import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext";

function useHealthList() {
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useUser();

  
  useEffect(() => {
   
    if (!userId) {
      setHealthList([]);
      setLoading(false);
      return;
    }
    setLoading(true); 
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
        setHealthList([]); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthList((prev) => {
        if (prev.length === 0) {
          return prev;
        }
        return prev.map((item) => ({
          ...item,
          timeRemaining: Math.max(0, item.timeRemaining - 1),
        }));
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { healthList, loading };
}


function calculateRemaining(recoveryEndTime) {
  if (!recoveryEndTime) return 0;
  const end = dayjs(recoveryEndTime);
  const now = dayjs();
  if (!end.isValid()) return 0;
  return Math.max(0, end.diff(now, "second"));
}

export default useHealthList;