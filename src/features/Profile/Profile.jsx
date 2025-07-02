// Profile.js (ĐÃ NÂNG CẤP VỚI API MỚI)

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import {
  FaCamera,
  FaCrown,
  FaPencilAlt,
  FaPiggyBank,
  FaTrophy,
  FaLeaf,
} from "react-icons/fa";

const Profile = () => {
  const [sessionUser, setSessionUser] = useState(null);

  // --- 1. THÊM STATE MỚI CHO DỮ LIỆU THỐNG KÊ ---
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  // Bạn có thể thêm state cho smokeFreeDays nếu có API tương ứng

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. CẬP NHẬT LOGIC FETCH DỮ LIỆU ---
  useEffect(() => {
    const fetchAllProfileData = async () => {
      try {
        // BƯỚC A: LẤY THÔNG TIN USER CƠ BẢN VÀ USER ID
        const userResponse = await fetch(
          "http://localhost:8080/api/auth/get-session-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!userResponse.ok) {
          throw new Error(`Lỗi xác thực: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        console.log("Dữ liệu người dùng nhận được từ API:", userData);
        setSessionUser(userData);
        setFormData({
          fullName: userData.name,
          email: userData.email,
        });

        // BƯỚC B: DÙNG USER ID ĐỂ GỌI CÁC API CÒN LẠI ĐỒNG THỜI
        if (userData && userData.userId) {
          const userId = userData.userId;

          // Tạo các promise cho các cuộc gọi API
          const achievementsPromise = fetch(
            `http://localhost:8080/api/achievements/${userId}`
          );
          const savingsPromise = fetch(
            `http://localhost:8080/api/quit-plan/${userId}/savings`
          );

          // Dùng Promise.all để thực thi đồng thời
          const [achievementsResponse, savingsResponse] = await Promise.all([
            achievementsPromise,
            savingsPromise,
          ]);

          // Xử lý kết quả achievements
          if (achievementsResponse.ok) {
            const achievementsData = await achievementsResponse.json();
            // Giả sử API trả về một mảng, chúng ta lấy độ dài của nó
            setAchievementsCount(achievementsData.length || 0);
          }

          // Xử lý kết quả savings
          if (savingsResponse.ok) {
            const savingsData = await savingsResponse.json();
            // Giả sử API trả về object { amount: 1500000 }
            setMoneySaved(savingsData.amount || 0);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang cá nhân:", err);
        setError("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProfileData();
  }, []); // Chỉ chạy một lần

  // Các hàm xử lý (handleEditClick, etc.) không thay đổi
  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    if (sessionUser) {
      setFormData({ fullName: sessionUser.name, email: sessionUser.email });
    }
    setIsEditing(false);
  };
  const handleSaveClick = () => {
    if (!sessionUser || !sessionUser.userId) {
      setError("Không thể xác định người dùng để cập nhật.");
      return;
    }
    const updateUrl = `http://localhost:8080/api/users/${sessionUser.userId}`;

    const dataToSend = {
      id: sessionUser.userId,
      name: formData.fullName,
      email: formData.email,
      userId: sessionUser.userId,
      password: sessionUser.password, // Bắt buộc vì backend báo lỗi thiếu trường này
      role: sessionUser.role,
      registrationDate: sessionUser.registrationDate,
      profilePicture: sessionUser.profilePicture,
      addictionLevel: sessionUser.addictionLevel,
    };
    console.log("Dữ liệu gửi đi để cập nhật:", dataToSend);
    axios
      .put(updateUrl, dataToSend, { withCredentials: true })
      .then((res) => {
        // Cập nhật thành công, làm mới state
        const updatedUser = res.data;
        setSessionUser((prevUser) => ({ ...prevUser, ...updatedUser }));
        setFormData({ fullName: updatedUser.name, email: updatedUser.email });
        setIsEditing(false);
        setError(null); // Xóa lỗi cũ nếu có
        console.log("Cập nhật thành công:", updatedUser);
      })
      .catch((err) => {
        // Xử lý lỗi
        console.error("Lỗi khi cập nhật:", err.response || err);
        setError(
          "Cập nhật thất bại. Vui lòng thử lại. Lỗi: " +
            (err.response?.data?.message || err.message)
        );
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="status-message">Đang tải thông tin...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="profile-container">
        <div className="status-message error">{error}</div>
      </div>
    );
  }
  if (!sessionUser) {
    return (
      <div className="profile-container">
        <div className="status-message">Không có dữ liệu người dùng.</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Thông tin cá nhân</h1>
        <p className="profile-subtitle">
          Quản lý thông tin và theo dõi tiến trình của bạn
        </p>

        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar"></div>
            {isEditing && (
              <div className="camera-icon">
                <FaCamera />
              </div>
            )}
          </div>
          <div className="premium-badge">
            <FaCrown /> Premium
          </div>
        </div>

        {/* --- 3. CẬP NHẬT JSX ĐỂ DÙNG STATE MỚI --- */}
        <div className="stats-grid">
          <div className="stat-item">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: "#e0f2fe" }}
            >
              <FaPiggyBank style={{ color: "#0ea5e9" }} />
            </div>
            <div className="stat-text">
              {/* Sử dụng state 'moneySaved' */}
              <h3>{moneySaved.toLocaleString("vi-VN") || 0} đ</h3>
              <p>Tiền tiết kiệm</p>
            </div>
          </div>
          <div className="stat-item">
            <div
              className="stat-icon-wrapper"
              style={{ backgroundColor: "#fefce8" }}
            >
              <FaTrophy style={{ color: "#eab308" }} />
            </div>
            <div className="stat-text">
              {/* Sử dụng state 'achievementsCount' */}
              <h3>{achievementsCount || 0}</h3>
              <p>Thành tựu đạt được</p>
            </div>
          </div>
        </div>
        {/* --- KẾT THÚC CẬP NHẬT JSX --- */}
        <div className="profile-form-section">
          <h2 className="form-section-title">Chi tiết tài khoản</h2>
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <div className="form-field">
                {isEditing ? (
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <>
                    <p className="info-text">{formData.fullName}</p>

                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="form-field">
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <>
                    <p className="info-text">{formData.email}</p>
                  </>
                )}
              </div>
            </div>
            <div className="button-group">
              {isEditing ? (
                <>
                  <button className="btn btn-primary" onClick={handleSaveClick}>
                    Lưu thay đổi
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelClick}
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button className="btn btn-dark" onClick={handleEditClick}>
                  <FaPencilAlt style={{ marginRight: "8px" }} />
                  Cập nhật thông tin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
