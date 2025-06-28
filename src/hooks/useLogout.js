// hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Giả sử bạn có UserContext để lấy userId

const useLogout = () => {
  const navigate = useNavigate();
  const { clearUserId } = useUser(); // Giả sử bạn có clearUserId để xóa userId khỏi context
  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      clearUserId(); // Xóa userId khỏi context
      navigate("/login"); // hoặc navigate("/", { replace: true });
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return logout;
};

export default useLogout;
