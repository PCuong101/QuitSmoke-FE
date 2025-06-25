// contexts/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(null);

  // Khi app khởi động, lấy userId từ localStorage (nếu có)
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserIdState(Number(storedUserId));
    }
  }, []);

  // Khi gọi setUserId, lưu luôn vào localStorage
  const setUserId = (id) => {
    localStorage.setItem("userId", id);
    setUserIdState(id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
