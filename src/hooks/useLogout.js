// hooks/useLogout.js
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      navigate("/login"); // hoặc navigate("/", { replace: true });
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return logout;
};

export default useLogout;
