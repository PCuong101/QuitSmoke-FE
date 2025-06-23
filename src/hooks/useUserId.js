// src/hooks/useUserId.js
import { useState, useEffect } from "react";

const useUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (!res.ok) throw new Error("Không tìm thấy user");
        const userData = await res.json();
        setUserId(userData.userId);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      }
    };

    fetchUser();
  }, []);

  return userId;
};

export default useUserId;
