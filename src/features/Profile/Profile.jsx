import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Không cần import useAuth nữa
// import { useAuth } from '../../context/AuthContext'; 
import './Profile.css';
import { FaCamera, FaCrown, FaPencilAlt, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  // State để lưu toàn bộ object người dùng lấy từ session
  const [sessionUser, setSessionUser] = useState(null); 
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect để lấy thông tin người dùng từ session
  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST", // Hoặc GET, tùy vào backend của bạn định nghĩa
          headers: {
            "Content-Type": "application/json"
          },
          // 'credentials: "include"' rất quan trọng để trình duyệt gửi kèm cookie session
          credentials: "include" 
        });

        if (!response.ok) {
          // Xử lý các lỗi HTTP như 401 (Unauthorized), 403 (Forbidden)
          throw new Error(`Lỗi xác thực: ${response.status}`);
        }

        const userData = await response.json();
        
        
        // Lưu toàn bộ object người dùng vào state
        setSessionUser(userData);

        // Ánh xạ dữ liệu từ API để hiển thị và chỉnh sửa
        const initialFormData = {
          fullName: userData.name,
          email: userData.email,
        };
        setFormData(initialFormData);

      } catch (err) {
        console.error("Lỗi khi lấy thông tin session:", err);
        setError("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionUser();
  }, []); // Mảng rỗng `[]` để chỉ chạy một lần duy nhất

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    // Reset form về dữ liệu gốc từ sessionUser
    if(sessionUser) {
        setFormData({
            fullName: sessionUser.name,
            email: sessionUser.email,
        });
    }
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    // Chỉ thực hiện khi có thông tin user
    if (!sessionUser || !sessionUser.id) {
        setError("Không thể xác định người dùng để cập nhật.");
        return;
    }

    const updateUrl = `http://localhost:8080/api/users/${sessionUser.id}`;
    
    // Dữ liệu để gửi lên server
    const dataToSend = {
      // Gửi cả ID nếu backend yêu cầu, hoặc chỉ các trường thay đổi
      id: sessionUser.id, 
      name: formData.fullName,
      email: formData.email,
    };

    // Dùng axios để gửi request PUT, tự động xử lý credentials nếu được cấu hình
    axios.put(updateUrl, dataToSend, { withCredentials: true })
      .then(res => {
         // Cập nhật lại sessionUser với thông tin mới nhất từ server
         setSessionUser(res.data);
         // Cập nhật form data để hiển thị
         setFormData({
            fullName: res.data.name,
            email: res.data.email,
         });
         setIsEditing(false);
         // Thông báo thành công (tùy chọn)
      })
      .catch(err => {
        console.error("Lỗi khi cập nhật:", err);
        setError("Cập nhật thất bại. Vui lòng thử lại.");
      });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // --- Render Logic ---
  if (loading) {
    return <div className="profile-container"><div className="status-message">Đang tải thông tin...</div></div>;
  }

  if (error) {
    return <div className="profile-container"><div className="status-message error">{error}</div></div>;
  }
  
  // Kiểm tra lần cuối trước khi render
  if (!sessionUser) {
    return <div className="profile-container"><div className="status-message">Không có dữ liệu người dùng.</div></div>;
  }
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Phần JSX giữ nguyên y hệt, không cần thay đổi gì ở đây */}
        <h1 className="profile-title">Thông tin cá nhân</h1>
        <p className="profile-subtitle">Quản lý thông tin tài khoản của bạn</p>

        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar"></div>
            {isEditing && <div className="camera-icon"><FaCamera /></div>}
          </div>
          <div className="premium-badge"><FaCrown /> Premium</div>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên</label>
            {isEditing ? (
              <input type="text" id="fullName" name="fullName" className="form-control" value={formData.fullName || ''} onChange={handleInputChange} />
            ) : (
              <p className="info-text">{formData.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            {isEditing ? (
              <input type="email" id="email" name="email" className="form-control" value={formData.email || ''} onChange={handleInputChange} />
            ) : (
              <p className="info-text">{formData.email}</p>
            )}
          </div>
          
          <div className="button-group">
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleSaveClick}>Lưu thay đổi</button>
                <button className="btn btn-secondary" onClick={handleCancelClick}>Hủy</button>
              </>
            ) : (
              <button className="btn btn-dark" onClick={handleEditClick}>
                <FaPencilAlt style={{ marginRight: '8px' }} />
                Cập nhật thông tin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;