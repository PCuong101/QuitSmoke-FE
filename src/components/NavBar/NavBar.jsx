import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
// import { mockTodayMissionList } from '../../features/Missions/mock-missions';
import * as icon from 'lucide-react';
import useLogout from '../../hooks/useLogout';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { useUser } from '../../contexts/UserContext.jsx';
import ToastNotification from '../ToastNotification/ToastNotification.jsx';

export default function NavBar(){
  const logout = useLogout();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, setNotifications } = useNotifications();

  const popupRef = useRef();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => setIsNotificationOpen(!isNotificationOpen);

  const handleItemClick = (notification) => {
    setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)));
    if (notification.link) {
      navigate(notification.link);
      setIsNotificationOpen(false);
    }
  };

  const handleDeleteNotification = (notificationId, event) => {
    event.stopPropagation(); // Ngăn việc click vào nút xóa cũng kích hoạt handleItemClick
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
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

  // ... Các phần code khác của NavBar giữ nguyên ...
  // (Phần style, fetch user, menu logout, và JSX return)
  // ... (Bạn có thể copy paste phần code còn lại của NavBar vào đây) ...

  const isActive = (path) => location.pathname === path || (path === '/achievement' && location.pathname.startsWith('/achievement'));

  const navItemStyle = (path) => ({
    margin: '0 10px',
    padding: '6px 12px',
    cursor: 'pointer',
    color: isActive(path) ? 'white' : 'black',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    background: isActive(path) ? 'rgba(22, 163, 74, 0.6)' : 'transparent',
    borderRadius: '8px',
    backdropFilter: isActive(path) ? 'blur(6px)' : 'none',
    WebkitBackdropFilter: isActive(path) ? 'blur(6px)' : 'none',
    transition: 'all 0.2s ease-in-out',
  });
  const [toastVisible, setToastVisible] = useState(false);

  const {userName, role} = useUser();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <div
      className="nav-bar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '5px',
        position: 'relative'
      }}
    >
      <h3><strong>QuitSmoking</strong></h3>
      <h4 style={navItemStyle('/dashboard')} onClick={() => navigate('/dashboard')}>Tổng quan</h4>
      <h4 style={navItemStyle('/diary')} onClick={() => navigate('/diary')}>Nhật ký</h4>
      <h4 style={navItemStyle('/missions')} onClick={() => navigate('/missions')}>Nhiệm vụ</h4>
      <h4 style={navItemStyle('/ranking')} onClick={() => navigate('/ranking')}>Bảng xếp hạng</h4>
      <h4 style={navItemStyle('/Achievement')} onClick={() => navigate('/Achievement')}>Thành tựu</h4>
      <h4 style={navItemStyle('/service-package')} onClick={() => navigate('/service-package')}>Gói dịch vụ</h4>
      <h4
        style={{
          ...navItemStyle('/coach'),
          opacity: role === 'MEMBER' ? 0.5 : 1,
          cursor: role === 'MEMBER' ? 'not-allowed' : 'pointer',
        }}
        onClick={() => {
          if (role === 'MEMBER') {
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000);
          } else {
            navigate('/coach');
        }
      }}
      >
        Chuyên gia
      </h4>

      <h4 style={navItemStyle('/blog')} onClick={() => navigate('/blog')}>Bài viết</h4>
      <div style={{ position: 'relative', marginLeft: 'auto' }} ref={userMenuRef}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setUserMenuOpen(prev => !prev)}
        >
          {role !== 'MEMBER' && (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fffbeb',
                color: '#b45309',
                padding: '2px 8px',
                borderRadius: '12px',
                marginLeft: '8px',
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '1',
                border: '1px solid #fde68a'
            }}>
                <icon.Crown size={14} style={{ marginRight: '4px' }} />
                <span>Premium</span>
            </div>
          )}

          
          <icon.User />
          <h4 style={{ marginLeft: 5 }}>{userName}</h4>
        </div>

        {userMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              zIndex: 1000,
              minWidth: '160px',
              padding: '8px 0',
            }}
          >
            <div
              onClick={() => navigate('/profile')}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#1f2937',
                whiteSpace: 'nowrap',
              }}
            >
              Thông tin cá nhân
            </div>
            <div
              onClick={logout}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#ef4444',
                whiteSpace: 'nowrap',
              }}
            >
              Đăng xuất
            </div>
          </div>
        )}
      </div>


      <div style={{ position: 'relative', marginLeft: 15 }} ref={popupRef}>
        <icon.Bell onClick={handleNotificationClick} style={{ cursor: 'pointer' }} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: -5,
            right: -5,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white' // Thêm viền trắng để nổi bật hơn
          }}>
            {unreadCount}
          </div>
        )}
        {isNotificationOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 15px)', // Vị trí đẹp hơn
            right: 0,
            width: 380, // Tăng chiều rộng để thoáng hơn
            background: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderRadius: '8px',
            zIndex: 1000,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            border: '1px solid #f0f0f0' // Thêm viền nhẹ
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              backgroundColor: '#f9fafb', // Nền xám nhạt như trong ảnh
            }}>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Thông báo</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#16a34a', // Màu xanh lá cây
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '4px 0'
                }}
              >
                Đánh dấu đã đọc
              </button>
            </div>

            {/* Danh sách thông báo */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.map((n, index) => {
                  // Helper nhỏ để lấy icon và style
                  const getIcon = (type) => {
                    const iconStyle = { width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '16px' };
                    if (type === 'achievement') return <div style={{ ...iconStyle, backgroundColor: '#fffbe6' }}><icon.Trophy size={20} color="#fbbd23" /></div>;
                    if (type === 'appointment') return <div style={{ ...iconStyle, backgroundColor: '#eef9ff' }}><icon.Calendar size={20} color="#3b82f6" /></div>;
                    if (type === 'reminder') return <div style={{ ...iconStyle, backgroundColor: '#fef2f2' }}><icon.AlarmClock size={20} color="#ef4444" /></div>;
                    // --- THÊM ICON CHO MISSION ---
                    if (type === 'mission') return <div style={{ ...iconStyle, backgroundColor: '#eef2ff' }}><icon.Target size={20} color="#4f46e5" /></div>;
                    return <div style={{ ...iconStyle, backgroundColor: '#f3f4f6' }}><icon.Bell size={20} color="#4b5563" /></div>;
                  };

                  return (
                    <div key={n.id}
                    className="notification-item"
                      onClick={() => handleItemClick(n)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        position: 'relative',
                        borderTop: '1px solid #f0f0f0',
                        backgroundColor: n.read ? '#ffffff' : '#f8fffa'
                      }}>
                      {getIcon(n.type)}
                      <div style={{ flex: 1, marginRight: '10px' }}>
                        <h5 style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '15px', lineHeight: '1.4' }}>
                          {n.title}
                        </h5>
                        <p style={{ margin: '4px 0 8px 0', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                          {n.description}
                        </p>
                        <small style={{ color: '#9ca3af', fontSize: '13px' }}>
                          {n.time}
                        </small>
                      </div>
                      {!n.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginTop: '6px'
                        }}></div>
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
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Không có thông báo nào</p>
              )}
            </div>
          </div>
        )}
      </div>
      <icon.MessageCircle style={{ marginLeft: 15 }} />

      <ToastNotification
        icon={icon.XCircle}
        message="Bạn cần nâng cấp gói dịch vụ để truy cập tính năng này"
        show={toastVisible}
        color="red"
      />

    </div>
  );
}