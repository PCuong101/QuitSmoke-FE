import React, { createContext, useState, useEffect, useContext } from 'react';

const NotificationContext = createContext();

// Hook tùy chỉnh (không đổi)
export const useNotifications = () => {
  return useContext(NotificationContext);
};

// --- COMPONENT PROVIDER ĐÃ ĐƯỢC NÂNG CẤP ---
export const NotificationProvider = ({ children }) => {
  // BƯỚC 1: KHỞI TẠO STATE TỪ LOCALSTORAGE
  const [notifications, setNotifications] = useState(() => {
    try {
      // Thử lấy danh sách thông báo đã lưu từ localStorage
      const storedNotifications = localStorage.getItem('app_notifications');
      // Nếu có, parse nó từ chuỗi JSON về lại mảng. Nếu không, trả về mảng rỗng.
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error("Lỗi khi đọc thông báo từ localStorage:", error);
      return []; // Nếu có lỗi (ví dụ JSON không hợp lệ), trả về mảng rỗng
    }
  });

  // BƯỚC 2: TỰ ĐỘNG LƯU VÀO LOCALSTORAGE MỖI KHI STATE THAY ĐỔI
  useEffect(() => {
    try {
      // Chuyển mảng notifications thành chuỗi JSON và lưu lại
      localStorage.setItem('app_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error("Lỗi khi lưu thông báo vào localStorage:", error);
    }
  }, [notifications]);

  // Các hàm thêm thông báo
  const addBookingNotification = (coachName, bookedSlot, formatDateFunc) => {
    const newNotification = {
      id: Date.now(),
      type: 'appointment',
      title: 'Đặt lịch hẹn thành công!',
      description: `Bạn đã đặt lịch thành công với chuyên gia ${coachName} vào ${formatDateFunc(bookedSlot.date)} (${bookedSlot.slotLabel === "1" ? "Sáng" : "Chiều"}).`,
      time: 'Vừa xong',
      read: false,
      link: '/coach',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addAchievementNotification = (achievement) => {
    const newNotification = {
      id: `ach-${Date.now()}-${achievement.customLogicKey}`,
      type: 'achievement',
      title: 'Thành tựu mới được mở khóa!',
      description: `Chúc mừng! Bạn đã đạt được: "${achievement.title}"`,
      time: 'Vừa xong',
      read: false,
      link: '/achievement',
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addMissionCompletionNotification = (mission) => {
    const newNotification = {
      id: `mission-complete-${mission.templateID}-${new Date().toISOString()}`,
      type: 'mission_complete', // Một loại mới để phân biệt với "nhiệm vụ mới"
      title: 'Nhiệm vụ hoàn thành!',
      description: `Chúc mừng! Bạn đã hoàn thành: "${mission.title}"`,
      time: 'Vừa xong',
      read: false, // Mặc định là chưa đọc
      link: '/missions', // Link về trang nhiệm vụ
    };
    // Thêm vào đầu danh sách
    setNotifications(prev => [newNotification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Giá trị cung cấp cho Context
  const value = {
    notifications,
    setNotifications,
    addBookingNotification,
    addAchievementNotification,
    addMissionCompletionNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
