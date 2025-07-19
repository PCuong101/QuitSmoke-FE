// Profile.js 

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
// --- 1. THAY ĐỔI IMPORT: Chuyển từ react-icons sang lucide-react ---
import { Crown, Pencil, PiggyBank, Trophy } from "lucide-react";
// --- 2. THÊM IMPORT: Import Modal mới tạo ---
import ImageUploadModal from "./ImageUploadModal";
// ----------------------------------------------------------------

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../contexts/UserContext";

const getAvatarUrl = (user) => {
  // 1. Kiểm tra xem user và user.name có tồn tại và không phải chuỗi rỗng
  if (user?.name?.trim()) {
    // 2. Định dạng tên: bỏ khoảng trắng thừa và thay thế bằng '+'
    const formattedName = user.name.trim().replace(/\s+/g, '+');
    // 3. Trả về URL từ ui-avatars
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
  }
  // 4. Nếu không, trả về một ảnh mặc định (fallback)
  return "/default-avatar.png";
};

const Profile = () => {
  const [sessionUser, setSessionUser] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, userName, email,userAvatar, setUserName, setEmail, setUserAvatar } =
    useUser();
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  useEffect(() => {
  
    if (!userId) {
      setLoading(false);
      setError("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }

   
    setFormData({ fullName: userName, email: email });
    setProfilePicturePreview(userAvatar);
    setLoading(true); // Bắt đầu loading cho các dữ liệu bổ sung

    const fetchAdditionalData = async () => {
      try {
    
        const userDetailsPromise = fetch(
          "http://localhost:8080/api/auth/get-session-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        const achievementsPromise = fetch(
          `http://localhost:8080/api/achievements/${userId}`,
          { credentials: "include" } // <-- THÊM VÀO ĐÂY
        );
        const savingsPromise = fetch(
          `http://localhost:8080/api/quit-plan/${userId}/savings`,
          { credentials: "include" } // <-- THÊM VÀO ĐÂY
        );

        const [userDetailsResponse, achievementsResponse, savingsResponse] =
          await Promise.all([
            userDetailsPromise,
            achievementsPromise,
            savingsPromise,
          ]);

        if (userDetailsResponse.ok) {
          const userData = await userDetailsResponse.json();
          setSessionUser(userData);
          setProfilePicturePreview(prevPreview => prevPreview || userData.profilePicture);
        } else {
          throw new Error(`Lỗi xác thực: ${userDetailsResponse.status}`);
        }

        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setAchievementsCount(achievementsData.length || 0);
        }

        if (savingsResponse.ok) {
          const savingsData = await savingsResponse.json();
          setMoneySaved(savingsData.totalSavings || 0);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang cá nhân:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu chi tiết.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdditionalData();

    
  }, [userId, userName, email, userAvatar]);

  const handleImageSelect = (file) => {
    setProfilePictureFile(file); // Lưu file thật để chuẩn bị upload
    setProfilePicturePreview(URL.createObjectURL(file)); // Cập nhật ảnh xem trước
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({ fullName: userName, email: email });
    // Quay về ảnh cũ
    setProfilePicturePreview(null);
    setProfilePictureFile(null); 
  };

  const handleSaveClick = async () => {
    if (!userId) {
      setError("Không thể xác định người dùng để cập nhật.");
      return;
    }

    let finalPictureUrl = sessionUser.profilePicture;

    // BƯỚC 1: Nếu có file ảnh mới đang chờ, tải nó lên trước
    if (profilePictureFile) {
      const pictureFormData = new FormData();
      pictureFormData.append("file", profilePictureFile);

      try {
        const uploadResponse = await axios.post(
          `http://localhost:8080/api/files/upload`,
          pictureFormData,
          { withCredentials: true }
        );
        finalPictureUrl = uploadResponse.data.url;
      } catch (uploadErr) {
        console.error("Lỗi khi tải ảnh lên:", uploadErr);
        setError("Tải ảnh đại diện thất bại. Vui lòng thử lại.");
        return;
      }
    }

    // BƯỚC 2: Cập nhật tất cả thông tin người dùng (tên, email, và URL ảnh)
    const updateUrl = `http://localhost:8080/api/users/${userId}`;
    const dataToSend = {
      name: formData.fullName,
      email: formData.email,
      profilePicture: finalPictureUrl, // Gửi URL ảnh mới hoặc cũ
    };

    try {
      const res = await axios.put(updateUrl, dataToSend, {
        withCredentials: true,
      });
      const updatedUser = res.data;

      // Cập nhật tất cả các state cần thiết
      setSessionUser((prev) => ({ ...prev, ...updatedUser }));
      setFormData({ fullName: updatedUser.name, email: updatedUser.email });
      setProfilePicturePreview(updatedUser.profilePicture);

      setUserName(updatedUser.name);
      setEmail(updatedUser.email);
      setUserAvatar(updatedUser.profilePicture); 
      // Dọn dẹp và thoát chế độ chỉnh sửa
      setProfilePictureFile(null);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      setError("Cập nhật thông tin thất bại.");
    }
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
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageSelect}
        currentImageUrl={profilePicturePreview}
      />
      <div className="profile-container-pf">
        <div className="profile-card-pf">
          <h1 className="profile-title-pf">Thông tin cá nhân</h1>
          <p className="profile-subtitle-pf">
            Quản lý thông tin và theo dõi tiến trình của bạn
          </p>

          <div className="profile-header-pf">
            <div
              className="avatar-container-pf"
              onClick={() => isEditing && setIsModalOpen(true)}
              style={{ cursor: isEditing ? "pointer" : "default" }}
            >
              <div
                className="avatar-pf"
                style={{
                  backgroundImage: `url(${
                    profilePicturePreview ||
                    // Ưu tiên 2: Ảnh từ server HOẶC tạo từ tên nếu ảnh server không có
                    (sessionUser.profilePicture || getAvatarUrl(sessionUser))
                  })`,
                }}
              ></div>
              {isEditing && (
                <div className="edit-avatar-icon-pf">
                  <Pencil size={32} />
                </div>
              )}
            </div>

            {sessionUser.role !== "MEMBER" && (
              <div className="premium-badge-pf">
                <Crown size={16} style={{ marginRight: "4px" }} /> Premium
              </div>
            )}
          </div>

          <div className="stats-grid-pf">
            <div className="stat-item-pf" style={{ backgroundColor: "#e0f2fe" }}>
              <div className="stat-icon-wrapper-pf" style={{ backgroundColor: "#e0f2fe" }}>
                <PiggyBank size={22} style={{ color: "#0ea5e9" }} />
              </div>
              <div className="stat-text-pf">
                <h3>{moneySaved.toLocaleString("vi-VN") || 0} đ</h3>
                <p>Tiền tiết kiệm</p>
              </div>
            </div>
            <div className="stat-item-pf" style={{ backgroundColor: "#fefce8" }}>
              <div className="stat-icon-wrapper-pf" style={{ backgroundColor: "#fefce8" }}>
                <Trophy size={22} style={{ color: "#eab308" }} />
              </div>
              <div className="stat-text-pf">
                <h3>{achievementsCount || 0}</h3>
                <p>Thành tựu đạt được</p>
              </div>
            </div>
          </div>
          <div className="profile-form-section-pf">
            <h2 className="form-section-title-pf">Chi tiết tài khoản</h2>
            <div className="profile-form-pf">
              <div className="form-group-pf">
                <label htmlFor="fullName">Họ và tên</label>
                <div className="form-field-pf">
                  {isEditing ? (
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-control-pf"
                      value={formData.fullName || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="info-text-pf">{formData.fullName}</p>
                  )}
                </div>
              </div>

              <div className="form-group-pf">
                <label htmlFor="email">Email</label>
                <div className="form-field-pf">
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control-pf"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="info-text-pf">{formData.email}</p>
                  )}
                </div>
              </div>
              <div className="button-group-pf">
                {isEditing ? (
                  <>
                    <button
                      className="btn-pf btn-primary-pf"
                      onClick={handleSaveClick}
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      className="btn-pf btn-secondary-pf"
                      onClick={handleCancelClick}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button className="btn-pf btn-dark-pf" onClick={handleEditClick}>
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
