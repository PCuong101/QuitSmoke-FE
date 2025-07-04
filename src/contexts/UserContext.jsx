import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(null);
  const [email, setEmailState] = useState(null);
  const [userName, setUserNameState] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserIdState(Number(storedUserId));
    }
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserNameState(String(storedUserName));
    }
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmailState(String(storedEmail));
    }
  }, []);

  const setUserId = (id) => {
    localStorage.setItem("userId", String(id));
    setUserIdState(Number(id));
  };

  const setUserName = (name) => {
    localStorage.setItem("userName", String(name));
    setUserNameState(String(name));
  };

  const setEmail = (email) => {
    localStorage.setItem("email", String(email));
    setEmailState(String(email));
  };

  const clearUserId = () => {
    localStorage.removeItem("userId");
    setUserIdState(null);
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        clearUserId,
        userName,
        setUserName,
        email,
        setEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
