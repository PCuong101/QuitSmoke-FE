import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Eye } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error loading users:", err));
  }, []);

  const getProgressColor = (level) => {
    if (level === "HIGH") return "red";
    if (level === "MEDIUM") return "orange";
    return "green";
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword.toLowerCase()) ||
      user.email.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h2>Quản lý người dùng</h2>
        <button className="btn btn-primary">Xem xếp hạng</button>
      </div>

      <div className="card">
        {/* --- TÌM KIẾM & LỌC --- */}
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

        {/* --- DANH SÁCH --- */}
        <h3 className="list-title">
          Danh sách người dùng ({filteredUsers.length})
        </h3>

        <div className="data-table">
          <div className="table-header">
            <div>Tên</div>
            <div>Email</div>
            <div>Ngày đăng ký</div>
            <div>Mức độ</div>
            <div>Vai trò</div>
            <div>Ảnh đại diện</div>
            <div>Hành động</div>
          </div>

          {filteredUsers.map((user, index) => (
            <div className="table-row" key={index}>
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>
                {new Date(user.registrationDate).toLocaleDateString("vi-VN")}
              </div>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div className="progress-bar-container">
                        <div
                          className={`progress-bar ${getProgressColor(
                            user.addictionLevel
                          )}`}
                          style={{
                            width:
                              user.addictionLevel === "HIGH"
                                ? "90%"
                                : user.addictionLevel === "MEDIUM"
                                  ? "60%"
                                  : "30%",
                          }}
                        ></div>
                        <span className="progress-text">{user.addictionLevel}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>

              </table>

              <div>{user.role}</div>
              <div>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="avatar"
                    width={30}
                    height={30}
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <span>Không có</span>
                )}
              </div>
              <div className="action-buttons">
                <button className="btn-icon">
                  <Eye size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
