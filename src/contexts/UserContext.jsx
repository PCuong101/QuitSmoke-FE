// contexts/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserIdState(Number(storedUserId));
    }
  }, []);

  const setUserId = (id) => {
    localStorage.setItem("userId", String(id));
    setUserIdState(Number(id));
  };

  const clearUserId = () => {
    localStorage.removeItem("userId");
    setUserIdState(null);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, clearUserId }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
