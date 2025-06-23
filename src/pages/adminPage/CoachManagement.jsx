// CoachManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, User, FilePenLine, Trash2 } from "lucide-react";

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const navigate = useNavigate();

  /* ─────────────────────────── API ─────────────────────────── */
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/coaches")
      .then((res) => setCoaches(res.data))
      .catch((err) => console.error("Error loading coaches:", err));
  }, []);

  /* ────────────────────────── Helpers ───────────────────────── */
  const handleRowClick = (coachId) => navigate(`/admin/coach/${coachId}`);
  const handleAddCoach = () => navigate("/admin/create-coach");

  /* ─────────────────────────── Render ───────────────────────── */
  return (
    <div className="coach-management-page">
      {/* ==== header =================================================== */}
      <div className="page-header">
        <h2>Huấn luyện viên</h2>
        <button className="btn btn-primary" onClick={handleAddCoach}>
          <Plus size={18} strokeWidth={2.5} />
          <span>Thêm chuyên gia</span>
        </button>
      </div>

      {/* ==== simple stats (chỉ còn tổng) ============================= */}
      <div className="stats-grid">
        <div className="card stat-card">
          <p>Tổng chuyên gia</p>
          <h3 className="stat-number">{coaches.length}</h3>
        </div>
      </div>

      {/* ==== table ==================================================== */}
      <div className="card">
        <h3 className="list-title">Danh sách chuyên gia</h3>

        <div className="data-table">
          {/* table header */}
          <div className="table-header">
            <div>Avatar</div>
            <div>Tên</div>
            <div>Email</div>
            <div>Hành động</div>
          </div>

          {/* table rows */}
          {coaches.map((coach) => (
            <div
              className="table-row"
              key={coach.id}
              onClick={() => handleRowClick(coach.id)}
              style={{ cursor: "pointer" }}
            >
              {/* avatar */}
              <div className="coach-avatar">
                {coach.avatar ? (
                  <img src={coach.avatar} alt={coach.name} />
                ) : (
                  /* fallback icon */
                  <User size={20} />
                )}
              </div>

              {/* name & email */}
              <div>{coach.name}</div>
              <div>{coach.email}</div>

              {/* actions */}
              <div
                className="action-buttons"
                onClick={(e) => e.stopPropagation()} // prevent row navigation
              >
                <button className="btn-icon">
                  <FilePenLine size={18} strokeWidth={1.5} />
                </button>
                <button className="btn-icon btn-icon-delete">
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachManagement;
