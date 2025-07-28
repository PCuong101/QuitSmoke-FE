// hooks/useLogout.js
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useNotifications } from "../contexts/NotificationContext";

const useLogout = () => {
  const navigate = useNavigate();
  const { clearUserId } = useUser(); // Giả sử bạn có clearUserId để xóa userId khỏi context
  const { clearNotifications } = useNotifications(); // Lấy hàm xóa thông báo từ context
  const logout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      clearUserId(); // Xóa userId khỏi context
      clearNotifications(); // Xóa tất cả thông báo
      navigate("/login"); // hoặc navigate("/", { replace: true });
      localStorage.removeItem("achievements");

    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  return logout;
};

export default useLogout;
