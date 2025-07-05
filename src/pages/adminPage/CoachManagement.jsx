import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, User, FilePenLine, Trash2 } from "lucide-react";

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();
  // 1. Thêm state để quản lý modal xóa
  const [coachToDelete, setCoachToDelete] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/coaches")
      .then((res) => setCoaches(res.data))
      .catch((err) => console.error("Error loading coaches:", err));
  }, []);

  // 2. Thêm các hàm xử lý cho việc xóa
  const handleOpenDeleteModal = (coach) => {
    setCoachToDelete(coach);
  };

  const handleCloseDeleteModal = () => {
    setCoachToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!coachToDelete) return;

    try {
      // Giả sử API để xóa coach là /api/admin/coaches/{id}
      await axios.delete(
        `http://localhost:8080/api/admin/coaches/${coachToDelete.id}`
      );

      // Cập nhật UI ngay lập tức
      setCoaches((prevCoaches) =>
        prevCoaches.filter((coach) => coach.id !== coachToDelete.id)
      );

      handleCloseDeleteModal();
    } catch (err) {
      console.error("Lỗi khi xóa chuyên gia:", err);
      alert("Đã xảy ra lỗi khi xóa chuyên gia. Vui lòng thử lại.");
      handleCloseDeleteModal();
    }
  };

  const handleRowClick = (coachId) => navigate(`/admin/coach/${coachId}`);
  const handleAddCoach = () => navigate("/admin/create-coach");

  return (
    <div className="coach-management-page">
      <div className="page-header">
        <h2>Huấn luyện viên</h2>
        <button className="btn btn-primary" onClick={handleAddCoach}>
          <Plus size={18} strokeWidth={2.5} />
          <span>Thêm chuyên gia</span>
        </button>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <p>Tổng chuyên gia</p>
          <h3 className="stat-number">{coaches.length}</h3>
        </div>
      </div>

      <div className="card">
        <h3 className="list-title">Danh sách chuyên gia</h3>
        <div className="data-table">
          <div className="table-header">
            <div>Avatar</div>
            <div>Tên</div>
            <div>Email</div>
            <div>Hành động</div>
          </div>

          {coaches.map((coach) => (
            <div className="table-row">
              <div className="coach-avatar">
                {coach.avatar ? (
                  <img src={coach.avatar} alt={coach.name} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div>{coach.name}</div>
              <div>{coach.email}</div>
              <div
                className="action-buttons"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn btn-text-action"
                  key={coach.id}
                  onClick={() => handleRowClick(coach.id)}
                  style={{ cursor: "pointer" }}
                >
                  Tạo lịch
                </button>
                {/* 3. Gắn sự kiện xóa vào nút */}
                <button
                  className="btn btn-icon-delete"
                  onClick={() => handleOpenDeleteModal(coach)}
                  style={{ cursor: "pointer" }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Thêm Modal xác nhận xóa */}
      {coachToDelete && (
        <div
          className="confirmation-modal-overlay"
          onClick={handleCloseDeleteModal}
        >
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa chuyên gia{" "}
              <strong>{coachToDelete.name}</strong> không?
            </p>
            <div className="modal-buttons">
              <button
                onClick={handleCloseDeleteModal}
                className="btn btn-secondary"
              >
                Không
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger">
                Có, xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachManagement;
