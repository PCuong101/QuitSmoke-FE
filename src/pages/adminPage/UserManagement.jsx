import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Eye, Trash2 } from "lucide-react";
import "./UserManagement.css"; // Đảm bảo bạn đã import file CSS

const UserManagement = () => {
  // ... (useState, useEffect, và các hàm xử lý xóa giữ nguyên)
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const handleOpenDeleteModal = (user) => setUserToDelete(user);
  const handleCloseDeleteModal = () => setUserToDelete(null);
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await axios.delete(`http://localhost:8080/api/users/${userToDelete.userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.userId !== userToDelete.userId));
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      alert("Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại.");
      handleCloseDeleteModal();
    }
  };


  const getRoleClass = (role) => {
    if (role === 'MEMBER_VIP1') return 'role-vip';
    return 'role-member';
  };
  
  // Sửa đổi hàm này để trả về class cho thanh tiến trình
  const getLevelClass = (level) => {
    if (level === 'HIGH') return 'level-high';
    if (level === 'MEDIUM') return 'level-medium';
    return 'level-low';
  };

  // HÀM MỚI: Tính độ rộng của thanh tiến trình
  const getProgressWidth = (level) => {
    if (level === 'HIGH') return '90%';
    if (level === 'MEDIUM') return '60%';
    return '30%';
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.role === "MEMBER" || user.role === "MEMBER_VIP1") &&
      (user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase()))
  );

  return (
    <div className="user-management-page">
      {/* ... (Header và thanh tìm kiếm giữ nguyên) ... */}
       <div className="page-header">
        <h2>Quản lý người dùng</h2>
        <button className="btn btn-primary">Xem xếp hạng</button>
      </div>

      <div className="card">
        <div className="search-filter-bar">
          <div className="input-with-icon">
            <Search className="input-icon" size={20} strokeWidth={2} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">
            <Filter size={16} strokeWidth={2.5} />
            <span>Bộ lọc</span>
          </button>
        </div>

        <div className="data-table-container">
          <div className="data-table">
            <div className="table-header">
              <div className="table-cell">Tên</div>
              <div className="table-cell">Ngày tham gia</div>
              <div className="table-cell">Mức độ</div>
              <div className="table-cell">Vai trò</div>
              <div className="table-cell" style={{ justifyContent: 'center' }}>Hành động</div>
            </div>

            {filteredUsers.map((user) => (
              <div className="table-row" key={user.userId}>
                {/* ... (Các cột khác giữ nguyên) ... */}
                 <div className="table-cell user-info">
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`}
                    alt="avatar"
                    className="user-avatar"
                  />
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                <div className="table-cell">
                  {new Date(user.registrationDate).toLocaleDateString("vi-VN")}
                </div>

                {/* THAY ĐỔI Ở ĐÂY: Thay thế huy hiệu bằng thanh tiến trình */}
                <div className="table-cell">
                  <div className="progress-bar-container-admin">
                    <div 
                      className={`progress-bar-fill ${getLevelClass(user.addictionLevel)}`}
                      style={{ width: getProgressWidth(user.addictionLevel) }}
                    >
                      <span className="progress-bar-text">
                        {user.addictionLevel === 'HIGH' ? 'Cao' : user.addictionLevel === 'MEDIUM' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="table-cell">
                  <span className={`badge ${getRoleClass(user.role)}`}>
                    {user.role === 'MEMBER_VIP1' ? 'VIP' : 'Thường'}
                  </span>
                </div>
                <div className="table-cell action-buttons" style={{ justifyContent: 'center' }}>
                  <button 
                    className="btn btn-icon-delete"
                    
                    onClick={() => handleOpenDeleteModal(user)} 
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* ... (Modal giữ nguyên) ... */}
      {userToDelete && (
        <div className="confirmation-modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete.name}</strong> không?</p>
            <div className="modal-buttons">
              <button onClick={handleCloseDeleteModal} className="btn btn-secondary">Không</button>
              <button onClick={handleConfirmDelete} className="btn btn-danger">Có, xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;