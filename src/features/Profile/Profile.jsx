// Profile.js (ĐÃ NÂNG CẤP VỚI API MỚI VÀ LUCIDE-REACT ICONS)

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
// --- 1. THAY ĐỔI IMPORT: Chuyển từ react-icons sang lucide-react ---
import {
  Camera,
  Crown,
  Pencil,
  PiggyBank,
  Trophy,
} from "lucide-react";
// ----------------------------------------------------------------

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const Profile = () => {
  const [sessionUser, setSessionUser] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProfileData = async () => {
      try {
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
        setSessionUser(userData);
        setFormData({
          fullName: userData.name,
          email: userData.email,
        });

        if (userData && userData.userId) {
          const userId = userData.userId;

          const achievementsPromise = fetch(
            `http://localhost:8080/api/achievements/${userId}`
          );
          const savingsPromise = fetch(
            `http://localhost:8080/api/quit-plan/${userId}/savings`
          );

          const [achievementsResponse, savingsResponse] = await Promise.all([
            achievementsPromise,
            savingsPromise,
          ]);

          if (achievementsResponse.ok) {
            const achievementsData = await achievementsResponse.json();
            setAchievementsCount(achievementsData.length || 0);
          }

          if (savingsResponse.ok) {
            const savingsData = await savingsResponse.json();
            setMoneySaved(savingsData.totalSavings || 0);
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
  }, []);

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
      password: sessionUser.password,
      role: sessionUser.role,
      registrationDate: sessionUser.registrationDate,
      profilePicture: sessionUser.profilePicture,
      addictionLevel: sessionUser.addictionLevel,
    };
    
    axios
      .put(updateUrl, dataToSend, { withCredentials: true })
      .then((res) => {
        const updatedUser = res.data;
        setSessionUser((prevUser) => ({ ...prevUser, ...updatedUser }));
        setFormData({ fullName: updatedUser.name, email: updatedUser.email });
        setIsEditing(false);
        setError(null);
      })
      .catch((err) => {
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
    <>
      <NavBar />
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
                  {/* --- 2. THAY THẾ ICON --- */}
                  <Camera size={18} />
                </div>
              )}
            </div>
            {sessionUser.role !== "MEMBER" && (
              <div className="premium-badge">
                {/* --- 2. THAY THẾ ICON --- */}
                <Crown size={16} style={{ marginRight: "4px" }} /> Premium
              </div>
            )}
          </div>

          <div className="stats-grid">
            <div className="stat-item" style={{ backgroundColor: "#e0f2fe" }}>
              <div
                className="stat-icon-wrapper"
                style={{ backgroundColor: "#e0f2fe" }}
              >
                {/* --- 2. THAY THẾ ICON --- */}
                <PiggyBank size={22} style={{ color: "#0ea5e9" }} />
              </div>
              <div className="stat-text">
                <h3>{moneySaved.toLocaleString("vi-VN") || 0} đ</h3>
                <p>Tiền tiết kiệm</p>
              </div>
            </div>
            <div className="stat-item" style={{ backgroundColor: "#fefce8" }}>
              <div
                className="stat-icon-wrapper"
                style={{ backgroundColor: "#fefce8" }}
              >
                {/* --- 2. THAY THẾ ICON --- */}
                <Trophy size={22} style={{ color: "#eab308" }} />
              </div>
              <div className="stat-text">
                <h3>{achievementsCount || 0}</h3>
                <p>Thành tựu đạt được</p>
              </div>
            </div>
          </div>
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
                    <p className="info-text">{formData.fullName}</p>
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
                    <p className="info-text">{formData.email}</p>
                  )}
                </div>
              </div>
              <div className="button-group">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveClick}
                    >
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
                    {/* --- 2. THAY THẾ ICON --- */}
                    <Pencil size={16} style={{ marginRight: "8px" }} />
                    Cập nhật thông tin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;