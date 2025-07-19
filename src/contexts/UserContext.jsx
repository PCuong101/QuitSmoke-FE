import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(null);
  const [email, setEmailState] = useState(null);
  const [userName, setUserNameState] = useState(null);
  const [role, setRoleState] = useState(null);
  const [user, setUser] = useState(null);
  

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
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(String(storedRole));
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

  const setRole = (role) => {
    localStorage.setItem("role", String(role));
    setRoleState(String(role));
  }

  const clearUserId = () => {
    localStorage.removeItem("userId");
    setUserIdState(null);
    localStorage.removeItem("userName");
    setUserNameState(null);
    localStorage.removeItem("email");
    setEmailState(null);
    localStorage.removeItem("role");
    setRoleState(null);
    
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
        role,
        setRole,
        user, setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
