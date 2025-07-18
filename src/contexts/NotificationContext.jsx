// src/contexts/NotificationContext.jsx (PHIÊN BẢN API-DRIVEN)

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useUser } from "./UserContext"; // Import useUser để lấy userId

// Context và Hook không đổi
const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useUser(); // Lấy userId từ UserContext

  // --- LOGIC MỚI: FETCH THÔNG BÁO TỪ SERVER ---
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]); // Nếu không có user, dọn dẹp danh sách
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/user/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        // Chuyển đổi DTO từ backend thành format của frontend nếu cần
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.content, // Đổi tên trường content -> description
          time: new Date(item.createdAt).toLocaleString("vi-VN"), // Format lại thời gian
          read: item.read,
          type: item.title.toLowerCase().includes("nhiệm vụ")
            ? "mission"
            : item.title.toLowerCase().includes("thành tựu")
            ? "achievement"
            : "reminder",
        }));
        setNotifications(formattedData);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Tự động fetch khi userId thay đổi
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // --- CÁC HÀM CẬP NHẬT TRẠNG THÁI ---
  const markAsRead = async (notificationId) => {
    // Cập nhật trạng thái ở frontend ngay lập tức để có phản hồi nhanh
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    // Gửi yêu cầu lên server
    try {
      await fetch(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
      // Có thể thêm logic để revert lại trạng thái nếu API lỗi
    }
  };

  const markAllAsRead = () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    // Cập nhật ở frontend
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Gửi nhiều yêu cầu lên server
    unreadNotifications.forEach((n) => markAsRead(n.id));
  };

  // Lưu ý: Backend chưa có API xóa, nên hàm này chỉ xóa ở frontend
  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    // Khi có API DELETE, sẽ gọi ở đây
  };

  // Các hàm tạo thông báo tạm thời ở client
  const addBookingNotification = (coachName, bookedSlot, formatDateFunc) => {
    const newNotification = {
      id: Date.now(),
      type: "appointment",
      title: "Đặt lịch hẹn thành công!",
      description: `Bạn đã đặt lịch thành công với chuyên gia ${coachName} vào ${formatDateFunc(
        bookedSlot.date
      )} (${bookedSlot.slotLabel === "1" ? "Sáng" : "Chiều"}).`,
      time: "Vừa xong",
      read: false,
      link: "/coach",
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const addAchievementNotification = (achievement) => {
    const newNotification = {
      id: `ach-${Date.now()}-${achievement.customLogicKey}`,
      type: "achievement",
      title: "Thành tựu mới được mở khóa!",
      description: `Chúc mừng! Bạn đã đạt được: "${achievement.title}"`,
      time: "Vừa xong",
      read: false,
      link: "/achievement",
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const addMissionCompletionNotification = (mission) => {
    const newNotification = {
      // Sử dụng ID của mission để tránh tạo thông báo trùng lặp nếu người dùng click nhanh
      id: `mission-complete-${mission.templateID}-${new Date().toISOString()}`,
      type: "mission_complete", // Một loại mới để phân biệt với "nhiệm vụ mới"
      title: "Nhiệm vụ hoàn thành!",
      description: `Chúc mừng! Bạn đã hoàn thành: "${mission.title}"`,
      time: "Vừa xong",
      read: false, // Mặc định là chưa đọc
      link: "/missions", // Link về trang nhiệm vụ
    };
    // Thêm vào đầu danh sách
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    // Các hàm cũ vẫn giữ lại để tương thích
    setNotifications,
    addBookingNotification,
    addAchievementNotification,
    addMissionCompletionNotification,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
