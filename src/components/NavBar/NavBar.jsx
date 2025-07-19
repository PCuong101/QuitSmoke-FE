// src/components/NavBar/NavBar.jsx (PHIÊN BẢN HOÀN CHỈNH)

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import * as icon from "lucide-react";
import useLogout from "../../hooks/useLogout";
import { useNotifications } from "../../contexts/NotificationContext.jsx"; // Context đã nâng cấp
import { useUser } from "../../contexts/UserContext.jsx";
import ToastNotification from "../ToastNotification/ToastNotification.jsx";
import "./NavBar.css";

export default function NavBar() {
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { userName, role ,userAvatar} = useUser();

  // === SỬA Ở ĐÂY: Lấy các hàm mới từ Context ===
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  // ===========================================

  const popupRef = useRef();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = () =>
    setIsNotificationOpen(!isNotificationOpen);

  // === SỬA Ở ĐÂY: Sử dụng hàm `markAsRead` từ Context ===
  const handleItemClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Logic điều hướng giữ nguyên
    if (notification.link) {
      navigate(notification.link);
      setIsNotificationOpen(false);
    }
  };

  // === SỬA Ở ĐÂY: Sử dụng hàm `deleteNotification` từ Context ===
  const handleDeleteNotification = (notificationId, event) => {
    event.stopPropagation();
    deleteNotification(notificationId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/achievement" && location.pathname.startsWith("/achievement"));

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nav-bar">
      {/* Phần bên trái */}
      <h3 className="nav-brand">QuitSmoking</h3>

      {/* Nhóm các link điều hướng */}
      <h4
        className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
        onClick={() => navigate("/dashboard")}
      >
        Tổng quan
      </h4>
      <h4
        className={`nav-item ${isActive("/diary") ? "active" : ""}`}
        onClick={() => navigate("/diary")}
      >
        Nhật ký
      </h4>
      <h4
        className={`nav-item ${isActive("/missions") ? "active" : ""}`}
        onClick={() => navigate("/missions")}
      >
        Nhiệm vụ
      </h4>
      <h4
        className={`nav-item ${isActive("/ranking") ? "active" : ""}`}
        onClick={() => navigate("/ranking")}
      >
        Bảng xếp hạng
      </h4>
      <h4
        className={`nav-item ${isActive("/achievement") ? "active" : ""}`}
        onClick={() => navigate("/achievement")}
      >
        Thành tựu
      </h4>
      <h4
        className={`nav-item ${isActive("/service-package") ? "active" : ""} ${
          role === "MEMBER" ? "disabled" : ""
        }`}
        onClick={() => navigate("/service-package")}
      >
        Gói dịch vụ
      </h4>
      <h4
        className={`nav-item ${isActive("/coach") ? "active" : ""} ${
          role === "MEMBER" ? "disabled" : ""
        }`}
        onClick={() => {
          if (role === "MEMBER") {
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
          } else {
            navigate("/coach");
          }
        }}
      >
        Chuyên gia
      </h4>
      <h4
        className={`nav-item ${isActive("/blog") ? "active" : ""}`}
        onClick={() => navigate("/blog")}
      >
        Bài viết
      </h4>

      {/* Phần bên phải - Bắt đầu bằng user-section có margin-left: auto */}
      <div className="user-section" ref={userMenuRef}>
        <div
          className="user-trigger"
          onClick={() => setUserMenuOpen((prev) => !prev)}
        >
          <img 
                src={userAvatar || '/default-avatar.png'} 
                alt="User Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px', objectFit: 'cover' }}
            />
          <h4 className="user-name">{userName}</h4>
          {role !== "MEMBER" && (
            <div className="premium-icon">
              <icon.Crown size={14} className="crown-icon" />
              <span>Premium</span>
            </div>
          )}
        </div>
        {userMenuOpen && (
          <div className="user-menu">
            <div
              className="user-menu-item"
              onClick={() => navigate("/profile")}
            >
              Thông tin cá nhân
            </div>
            <div className="user-menu-item logout" onClick={logout}>
              Đăng xuất
            </div>
          </div>
        )}
      </div>

      <div className="notification-section" ref={popupRef}>
        <icon.Bell
          onClick={handleNotificationClick}
          style={{ cursor: "pointer" }}
        />
        {unreadCount > 0 && (
          <div
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: 16,
              height: 16,
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
            }}
          >
            {unreadCount}
          </div>
        )}

        {isNotificationOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 15px)",
              right: 0,
              width: 380,
              background: "#ffffff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              borderRadius: "8px",
              zIndex: 1000,
              fontFamily:
                'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              border: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 20px",
                backgroundColor: "#f9fafb",
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Thông báo
              </h4>
              {/* === SỬA Ở ĐÂY: Gọi hàm `markAllAsRead` từ Context === */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#16a34a",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "4px 0",
                }}
              >
                Đánh dấu đã đọc
              </button>
            </div>

            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {notifications.length > 0 ? (
                notifications.map((n) => {
                  const getIcon = (type) => {
                    const iconStyle = {
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginRight: "16px",
                    };
                    if (type === "achievement")
                      return (
                        <div
                          style={{ ...iconStyle, backgroundColor: "#fffbe6" }}
                        >
                          <icon.Trophy size={20} color="#fbbd23" />
                        </div>
                      );
                    if (type === "appointment")
                      return (
                        <div
                          style={{ ...iconStyle, backgroundColor: "#eef9ff" }}
                        >
                          <icon.Calendar size={20} color="#3b82f6" />
                        </div>
                      );
                    if (type === "reminder")
                      return (
                        <div
                          style={{ ...iconStyle, backgroundColor: "#fef2f2" }}
                        >
                          <icon.AlarmClock size={20} color="#ef4444" />
                        </div>
                      );
                    if (type === "mission_complete")
                      return (
                        <div
                          style={{ ...iconStyle, backgroundColor: "#eef2ff" }}
                        >
                          <icon.CheckCircle size={20} color="#4f46e5" />
                        </div>
                      );
                    return (
                      <div style={{ ...iconStyle, backgroundColor: "#f3f4f6" }}>
                        <icon.Bell size={20} color="#4b5563" />
                      </div>
                    );
                  };
                  return (
                    <div
                      key={n.id}
                      className="notification-item"
                      onClick={() => handleItemClick(n)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        padding: "16px 20px",
                        cursor: "pointer",
                        position: "relative",
                        borderTop: "1px solid #f0f0f0",
                        backgroundColor: n.read ? "#ffffff" : "#f8fffa",
                      }}
                    >
                      {getIcon(n.type)}
                      <div style={{ flex: 1, marginRight: "10px" }}>
                        <h5
                          style={{
                            margin: 0,
                            fontWeight: "600",
                            color: "#1f2937",
                            fontSize: "15px",
                            lineHeight: "1.4",
                          }}
                        >
                          {n.title}
                        </h5>
                        <p
                          style={{
                            margin: "4px 0 8px 0",
                            color: "#4b5563",
                            fontSize: "14px",
                            lineHeight: "1.5",
                          }}
                        >
                          {n.description}
                        </p>
                        <small style={{ color: "#9ca3af", fontSize: "13px" }}>
                          {n.time}
                        </small>
                      </div>
                      {!n.read && (
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#3b82f6",
                            borderRadius: "50%",
                            flexShrink: 0,
                            marginTop: "6px",
                          }}
                        ></div>
                      )}
                      <button
                        className="delete-notification-button"
                        onClick={(e) => handleDeleteNotification(n.id, e)}
                        title="Xóa thông báo"
                      >
                        <icon.X size={16} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#6b7280",
                  }}
                >
                  Không có thông báo nào
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <ToastNotification
        icon={icon.XCircle}
        message="Bạn cần nâng cấp gói dịch vụ để truy cập tính năng này"
        show={toastVisible}
        color="red"
      />
    </div>
  );
}
