// Profile.js 

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
// Import các icon cần thiết
import { Crown, Pencil, PiggyBank, Trophy } from "lucide-react";
import ImageUploadModal from "./ImageUploadModal";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useUser } from "../../contexts/UserContext";

const getAvatarUrl = (user) => {
  if (user?.name?.trim()) {
    const formattedName = user.name.trim().replace(/\s+/g, '+');
    return `https://ui-avatars.com/api/?name=${formattedName}&background=random`;
  }
  return "/default-avatar.png";
};

const Profile = () => {
  const [sessionUser, setSessionUser] = useState(null);
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [moneySaved, setMoneySaved] = useState(0);
  
  // Chỉ còn một state duy nhất cho chế độ chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userId, userName, email, userAvatar, setUserName, setEmail, setUserAvatar } = useUser();
  
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
      return;
    }
   
    setFormData({ 
      fullName: userName, 
      email: email, 
      password: '', 
      confirmPassword: '' 
    });
    setProfilePicturePreview(userAvatar);
    setLoading(true);

    const fetchAdditionalData = async () => {
      try {
        const userDetailsPromise = fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const achievementsPromise = fetch(`http://localhost:8080/api/achievements/${userId}`, { credentials: "include" });
        const savingsPromise = fetch(`http://localhost:8080/api/quit-plan/${userId}/savings`, { credentials: "include" });

        const [userDetailsResponse, achievementsResponse, savingsResponse] = await Promise.all([
          userDetailsPromise,
          achievementsPromise,
          savingsPromise,
        ]);

        if (userDetailsResponse.ok) {
          const userData = await userDetailsResponse.json();
          setSessionUser(userData);
          setProfilePicturePreview(prev => prev || userData.profilePicture);
          // Cập nhật lại form data với dữ liệu mới nhất từ server
          setFormData(prev => ({...prev, fullName: userData.name, email: userData.email}));
        } else {
          throw new Error(`Lỗi xác thực: ${userDetailsResponse.status}`);
        }
        if (achievementsResponse.ok) setAchievementsCount((await achievementsResponse.json()).length || 0);
        if (savingsResponse.ok) setMoneySaved((await savingsResponse.json()).totalSavings || 0);

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
    setProfilePictureFile(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null); // Xóa lỗi cũ khi bắt đầu chỉnh sửa
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset về giá trị gốc từ state
    setFormData({ 
        fullName: sessionUser.name, 
        email: sessionUser.email,
        password: '',
        confirmPassword: ''
    });
    setProfilePicturePreview(sessionUser.profilePicture || userAvatar);
    setProfilePictureFile(null); 
    setError(null);
  };

  const handleSaveClick = async () => {
    setError(null); // Reset lỗi trước khi lưu
    
    // BƯỚC 1: Xử lý upload ảnh (nếu có)
    let finalPictureUrl = sessionUser.profilePicture;
    if (profilePictureFile) {
      const pictureFormData = new FormData();
      pictureFormData.append("file", profilePictureFile);
      try {
        const uploadResponse = await axios.post(`http://localhost:8080/api/files/upload`, pictureFormData, { withCredentials: true });
        finalPictureUrl = uploadResponse.data.url;
      } catch (uploadErr) {
        setError("Tải ảnh đại diện thất bại. Vui lòng thử lại.");
        return;
      }
    }
    
    // BƯỚC 2: Xây dựng đối tượng dữ liệu cơ bản để gửi đi
    const dataToSend = {
      name: formData.fullName,
      email: formData.email,
      profilePicture: finalPictureUrl,
    };

    // BƯỚC 3: Xử lý mật khẩu một cách có điều kiện
    // Chỉ xử lý nếu người dùng có nhập vào các ô mật khẩu
    if (formData.password || formData.confirmPassword) {
      // Nếu đã bắt đầu nhập, phải kiểm tra các điều kiện
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu mới và mật khẩu xác nhận không khớp.');
        return; // Dừng lại nếu không khớp
      }
      
      if (!formData.password) { // Hoặc có thể dùng !formData.password.trim()
        setError('Mật khẩu mới không được để trống nếu bạn muốn thay đổi.');
        return; // Dừng lại nếu rỗng
      }

      // Nếu tất cả kiểm tra đều ổn, THÊM trường password vào đối tượng gửi đi
      dataToSend.password = formData.password;
    }
    // Nếu người dùng không nhập gì vào các ô mật khẩu, `dataToSend` sẽ không có trường `password`.

    // BƯỚC 4: Gửi request API
    try {
      const res = await axios.put(`http://localhost:8080/api/users/${userId}`, dataToSend, { withCredentials: true });
      const updatedUser = res.data;

      // Cập nhật tất cả state sau khi thành công
      setSessionUser(prev => ({ ...prev, ...updatedUser }));
      setFormData({ 
          fullName: updatedUser.name, 
          email: updatedUser.email,
          password: '', // Luôn reset các trường password về rỗng
          confirmPassword: ''
      });
      setProfilePicturePreview(updatedUser.profilePicture);
      setUserName(updatedUser.name);
      setEmail(updatedUser.email);
      setUserAvatar(updatedUser.profilePicture); 
      
      setProfilePictureFile(null);
      setIsEditing(false); // Thoát chế độ chỉnh sửa
      alert('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error("Lỗi khi cập nhật thông tin:", err);
      const errorMessage = err.response?.data?.message || 'Cập nhật thông tin thất bại.';
      setError(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) return <div className="profile-container"><div className="status-message">Đang tải thông tin...</div></div>;
  if (error && !isEditing) return <div className="profile-container"><div className="status-message error">{error}</div></div>;
  if (!sessionUser) return <div className="profile-container"><div className="status-message">Không có dữ liệu người dùng.</div></div>;

  return (
    <>
      <NavBar />
      <ImageUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onImageSelect={handleImageSelect} currentImageUrl={profilePicturePreview} />
      <div className="profile-container-pf">
        <div className="profile-card-pf">
          <h1 className="profile-title-pf">Thông tin cá nhân</h1>
          <p className="profile-subtitle-pf">Quản lý thông tin và theo dõi tiến trình của bạn</p>
          <div className="profile-header-pf">
            <div className="avatar-container-pf" onClick={() => isEditing && setIsModalOpen(true)} style={{ cursor: isEditing ? "pointer" : "default" }}>
              <div className="avatar-pf" style={{ backgroundImage: `url(${profilePicturePreview || (sessionUser.profilePicture || getAvatarUrl(sessionUser))})` }}></div>
              {isEditing && <div className="edit-avatar-icon-pf"><Pencil size={32} /></div>}
            </div>
            {sessionUser.role !== "MEMBER" && <div className="premium-badge-pf"><Crown size={16} style={{ marginRight: "4px" }} /> Premium</div>}
          </div>
          <div className="stats-grid-pf">
            <div className="stat-item-pf" style={{ backgroundColor: "#e0f2fe" }}><div className="stat-icon-wrapper-pf" style={{ backgroundColor: "#e0f2fe" }}><PiggyBank size={22} style={{ color: "#0ea5e9" }} /></div><div className="stat-text-pf"><h3>{moneySaved.toLocaleString("vi-VN") || 0} đ</h3><p>Tiền tiết kiệm</p></div></div>
            <div className="stat-item-pf" style={{ backgroundColor: "#fefce8" }}><div className="stat-icon-wrapper-pf" style={{ backgroundColor: "#fefce8" }}><Trophy size={22} style={{ color: "#eab308" }} /></div><div className="stat-text-pf"><h3>{achievementsCount || 0}</h3><p>Thành tựu đạt được</p></div></div>
          </div>
          
          <div className="profile-form-section-pf">
            <h2 className="form-section-title-pf">Chi tiết tài khoản</h2>
            <div className="profile-form-pf">
              {/* Họ và tên */}
              <div className="form-group-pf"><label htmlFor="fullName">Họ và tên</label><div className="form-field-pf">{isEditing ? (<input type="text" id="fullName" name="fullName" className="form-control-pf" value={formData.fullName || ""} onChange={handleInputChange} />) : (<p className="info-text-pf">{formData.fullName}</p>)}</div></div>
              {/* Email */}
              <div className="form-group-pf"><label htmlFor="email">Email</label><div className="form-field-pf">{isEditing ? (<input type="email" id="email" name="email" className="form-control-pf" value={formData.email || ""} onChange={handleInputChange} />) : (<p className="info-text-pf">{formData.email}</p>)}</div></div>
              
              {/* Mật khẩu */}
              {isEditing ? (
                // Khi đang chỉnh sửa, hiển thị ô nhập mật khẩu
                <>
                  <div className="form-group-pf">
                    <label htmlFor="password">
                      Mật khẩu mới 
                      <small style={{ fontWeight: 'normal', marginLeft: '8px' }}>(Để trống nếu không đổi)</small>
                    </label>
                    <div className="form-field-pf">
                      <input type="password" id="password" name="password" placeholder="Nhập mật khẩu mới" className="form-control-pf" value={formData.password} onChange={handleInputChange}/>
                    </div>
                  </div>
                  <div className="form-group-pf">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                    <div className="form-field-pf">
                      <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu mới" className="form-control-pf" value={formData.confirmPassword} onChange={handleInputChange}/>
                    </div>
                  </div>
                </>
              ) : (
                // Khi đang ở chế độ xem, hiển thị label và dấu chấm
                <div className="form-group-pf">
                    <label>Mật khẩu</label>
                    <div className="form-field-pf">
                        <p className="info-text-pf">••••••••</p>
                    </div>
                </div>
              )}

              {/* Hiển thị lỗi chung cho cả form */}
              {error && isEditing && <p className="error-text-pf" style={{width: '100%'}}>{error}</p>}
              
              {/* Nhóm nút bấm */}
              <div className="button-group-pf">
                {isEditing ? (<>
                  <button className="btn-pf btn-primary-pf" onClick={handleSaveClick}>Lưu thay đổi</button>
                  <button className="btn-pf btn-secondary-pf" onClick={handleCancelClick}>Hủy</button>
                </>) : (
                  <button className="btn-pf btn-dark-pf" onClick={handleEditClick}><Pencil size={16} style={{ marginRight: "8px" }} />Cập nhật thông tin</button>
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