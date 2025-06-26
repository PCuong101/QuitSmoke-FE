// src/pages/CoachDashboardPage.jsx

import { useState, useEffect } from "react";
import CoachNavBar from "../components/NavBar/CoachNavBar"; 
import Footer from "../components/Footer/Footer";
import useUserId from "../hooks/useUserId";
import "../styles/CoachDashboardPage.css"; // Sẽ cập nhật file này
import dayjs from "dayjs";

import "dayjs/locale/vi";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(updateLocale);
dayjs.locale('vi');

// Helper function để format ngày tháng (giống bên Member)
function formatDateWithWeekday(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function CoachDashboardPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule'); // State cho tab
  const userId = useUserId();

  const fetchCoachSchedules = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/coach/${userId}/schedule`);
      if (!response.ok) throw new Error("Lỗi khi tải dữ liệu lịch hẹn của coach");
      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSchedules(sortedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn đánh dấu cuộc hẹn này là đã hoàn thành?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/finish`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Không thể hoàn thành cuộc hẹn.');
      alert('Đã cập nhật trạng thái thành FINISHED!');
      fetchCoachSchedules(); 
    } catch (error) {
      console.error("Lỗi khi hoàn thành booking:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchCoachSchedules();
  }, [userId]);

  // Lọc dữ liệu cho các tab
  const activeBookings = schedules.filter(s => s.bookingStatus === 'BOOKED');
  const pastBookings = schedules.filter(s => s.bookingStatus === 'FINISHED' || s.bookingStatus === 'CANCELED');

  const renderScheduleList = (bookings) => {
    if (bookings.length === 0) {
      return <p>Không có lịch hẹn nào trong mục này.</p>;
    }
    return bookings.map(schedule => (
      <div key={schedule.scheduleId} className="schedule-card">
        <div className="card-header">
          <span className="date-tag">{dayjs(schedule.date).format("dddd, DD/MM/YYYY")}</span>
          {schedule.bookingStatus && schedule.bookingStatus !== 'UNKNOWN' && (
            <span className={`status-tag status-${schedule.bookingStatus.toLowerCase()}`}>
              {schedule.bookingStatus}
            </span>
          )}
        </div>
        <div className="card-body">
           <p><strong>Slot:</strong> {schedule.slotLabel === "1" ? "Sáng" : "Chiều"}</p>
           {schedule.bookedByName ? (
             <>
                <p><strong>Người đặt:</strong> {schedule.bookedByName} ({schedule.bookedByEmail})</p>
                <p><strong>Triệu chứng:</strong> {schedule.notes || "Không có ghi chú"}</p>
             </>
           ) : (
             <p><i>Thông tin người đặt không có sẵn (có thể lịch đã kết thúc hoặc bị hủy).</i></p>
           )}
        </div>
        <div className="card-actions">
          <a href="https://meet.google.com/" target="_blank" rel="noopener noreferrer" className="btn-action btn-meet" disabled={schedule.bookingStatus !== 'BOOKED'}>
            Vào buổi gặp
          </a>
          <button 
            className="btn-action btn-finish"
            disabled={schedule.bookingStatus !== 'BOOKED'}
            onClick={() => handleFinishBooking(schedule.bookingId)}
          >
            Đánh dấu hoàn thành
          </button>
        </div>
      </div>
    ));
  };


  return (
    <div className="page-wrapper">
      <CoachNavBar /> 
      <div className="coach-dashboard-container">
        
        {/* --- BẢNG LỊCH TỔNG QUAN --- */}
        <div className="availability-container">
          <h2 className="section-title">Tổng quan lịch làm việc</h2>
          <div className="coach-slot-grid">
            {loading ? <p>Đang tải lịch...</p> : schedules.map(s => (
              <div
                key={s.scheduleId}
                className={`coach-slot ${s.bookingStatus !== 'EMPTY' ? "slot-booked" : "slot-available"}`}
              >
                <div>{formatDateWithWeekday(s.date)}</div>
                <div>{s.slotLabel === "1" ? "Sáng" : "Chiều"}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- HỆ THỐNG TAB --- */}
        <div className="tab-navigation">
          <div
            className={`tab-item ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            Lịch làm việc ({activeBookings.length})
          </div>
          <div
            className={`tab-item ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Lịch sử ({pastBookings.length})
          </div>
        </div>

        {/* --- NỘI DUNG TAB --- */}
        <div className="tab-content">
          {loading ? (
            <h2>Đang tải...</h2>
          ) : (
            <>
              {activeTab === 'schedule' && (
                <div className="schedule-list">
                  <h2 className="section-title">Lịch hẹn sắp tới</h2>
                  {renderScheduleList(activeBookings)}
                </div>
              )}
              {activeTab === 'history' && (
                <div className="schedule-list">
                  <h2 className="section-title">Lịch hẹn đã qua</h2>
                  {renderScheduleList(pastBookings)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoachDashboardPage;