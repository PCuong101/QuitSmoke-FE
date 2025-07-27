import React, { createContext, useState, useEffect, useContext } from 'react';
import { useUser } from './UserContext';

const NotificationContext = createContext();

// Hook tùy chỉnh
export const useNotifications = () => {
  return useContext(NotificationContext);
};

// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';

// --- COMPONENT PROVIDER ĐÃ ĐƯỢC NÂNG CẤP ---
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();

  // Fetch thông báo từ backend
  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Lỗi khi lấy thông báo:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi fetch thông báo:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load thông báo khi userId thay đổi
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [userId]);

  // Đánh dấu thông báo đã đọc
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Cập nhật state local
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
      } else {
        console.error('Lỗi khi đánh dấu đã đọc:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}/read-all`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Cập nhật state local
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
      } else {
        console.error('Lỗi khi đánh dấu tất cả đã đọc:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', error);
    }
  };

  // Xóa thông báo
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Cập nhật state local
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
      } else {
        console.error('Lỗi khi xóa thông báo:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi khi xóa thông báo:', error);
    }
  };

  // Làm mới danh sách thông báo
  const refreshNotifications = () => {
    fetchNotifications();
  };

  // Xóa tất cả thông báo (cho logout)
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Tính toán số thông báo chưa đọc
  const unreadCount = notifications.filter(n => !n.read).length;

  // Định dạng thời gian hiển thị
  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return 'Vừa xong';
    
    const now = new Date();
    const notificationTime = new Date(createdAt);
    const diffInMs = now - notificationTime;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return notificationTime.toLocaleDateString('vi-VN');
  };

  // Giá trị cung cấp cho Context
  const value = {
    notifications,
    loading,
    unreadCount,
    setNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    clearNotifications,
    formatNotificationTime,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
