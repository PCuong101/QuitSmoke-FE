import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftCircle, CalendarCheck2 } from "lucide-react";

const CoachDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/admin/coach/${id}`)
      .then((res) => {
        setCoach(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch coach detail:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading coach details...</p>;
  if (!coach) return <p>Coach not found.</p>;

  return (
    <div className="coach-detail-page">
      <div className="page-header">
        <h2>Chi tiết chuyên gia</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeftCircle size={18} /> Quay lại
        </button>
      </div>

      <div className="card coach-info-card">
        <div className="coach-header">
          <img
            src={coach.avatar || "/default-avatar.png"}
            alt="avatar"
            className="coach-avatar"
          />
          <div>
            <h3>{coach.name}</h3>
            <p>{coach.email}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="list-title">
          <CalendarCheck2 size={18} /> Lịch làm việc
        </h3>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Slot</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {coach.schedules.map((schedule) => (
              <tr key={schedule.scheduleId}>
                <td>{schedule.slotLabel}</td>
                <td>{schedule.date}</td>
                <td>
                  <span
                    className={
                      schedule.available ? "status-ready" : "status-busy"
                    }
                  >
                    {schedule.available ? "Sẵn sàng" : "Không sẵn sàng"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoachDetail;
