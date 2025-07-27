import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, User, FilePenLine, Trash2, Loader2 } from "lucide-react";

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();
  
  const [coachToDelete, setCoachToDelete] = useState(null);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(null); // Track which coach is having schedule created

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/coaches")
      .then((res) => {
        setCoaches(res.data);
      })
      
      .catch((err) => console.error("Error loading coaches:", err));
  }, []);

 
  const handleOpenDeleteModal = (coach) => {
    setCoachToDelete(coach);
  };

  const handleCloseDeleteModal = () => {
    setCoachToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!coachToDelete) return;

    try {
      
      await axios.delete(
        `http://localhost:8080/api/users/${coachToDelete.id}` 
      );

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

  const handleRowClick = async (coachId) => {
    try {
      setIsCreatingSchedule(coachId); // Set loading state for this coach
      
      // Gọi API tạo lịch cho coach
      const response = await axios.post(
        `http://localhost:8080/api/admin/coach/${coachId}/create-schedule`,
        {}, // Body có thể trống hoặc chứa thông tin cần thiết
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate(`/admin/coach/${coachId}`);
      }
    } catch (error) {
      console.error("Lỗi khi tạo lịch:", error);
      
      // Hiển thị thông báo lỗi cho user
      if (error.response?.status === 400) {
        alert("Lịch cho chuyên gia này đã tồn tại hoặc dữ liệu không hợp lệ.");
      } else if (error.response?.status === 404) {
        alert("Không tìm thấy chuyên gia.");
      } else {
        alert("Đã xảy ra lỗi khi tạo lịch. Vui lòng thử lại.");
      }
    } finally {
      setIsCreatingSchedule(null); // Clear loading state
    }
  };
  const handleAddCoach = () => navigate("/admin/create-coach");

  return (
    <div className="coach-management-page">
      <div className="page-header">
        <h2>Chuyên gia</h2>
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
                  disabled={isCreatingSchedule === coach.id}
                  style={{ 
                    cursor: isCreatingSchedule === coach.id ? "not-allowed" : "pointer",
                    opacity: isCreatingSchedule === coach.id ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {isCreatingSchedule === coach.id && (
                    <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  )}
                  {isCreatingSchedule === coach.id ? "Đang tạo..." : "Tạo lịch"}
                </button>
               
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
