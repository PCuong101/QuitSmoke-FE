// src/pages/CoachDashboardPage.jsx

import { useState, useEffect } from "react";
import CoachNavBar from "../components/NavBar/CoachNavBar"; 
import Footer from "../components/Footer/Footer";
import useUserId from "../hooks/useUserId"; // Sử dụng lại hook này để ổn định hơn
import "../styles/CoachDashboardPage.css";
import dayjs from "dayjs";

import "dayjs/locale/vi";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(updateLocale);
dayjs.locale('vi');

function CoachDashboardPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useUserId();

  // --- SỬA LỖI 1: DI CHUYỂN CÁC HÀM VÀO TRONG COMPONENT ---

  // Hàm fetch dữ liệu
  const fetchCoachSchedules = async () => {
    if (!userId) {
      setLoading(false); // Nếu không có ID thì cũng dừng loading
      return;
    }
    // Không cần setLoading(true) ở đây để tránh giật màn hình khi refresh
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

  // Hàm để hoàn thành cuộc hẹn
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
      fetchCoachSchedules(); // <-- Bây giờ nó đã có thể gọi hàm này trực tiếp!
      
    } catch (error) {
      console.error("Lỗi khi hoàn thành booking:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchCoachSchedules();
  }, [userId]);

  const renderContent = () => {
    if (loading) {
      return <h2>Đang tải lịch làm việc...</h2>;
    }
    if (!userId) {
        return <h2>Không thể xác định được ID của Coach. Vui lòng đăng nhập lại.</h2>
    }

    const bookedSchedules = schedules.filter(s => s.bookingStatus !== 'EMPTY');
    if (bookedSchedules.length === 0) {
      return <p>Hiện tại bạn chưa có lịch hẹn nào được đặt.</p>;
    }

    return bookedSchedules.map(schedule => (
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
          <button className="btn-action btn-meet" disabled={schedule.bookingStatus !== 'BOOKED'}>
            Vào buổi gặp
          </button>
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
        <header className="page-header">
            <h1>Lịch làm việc</h1>
            <p>Quản lý các cuộc hẹn đã được đặt bởi thành viên.</p>
        </header>
        <div className="schedule-list">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CoachDashboardPage;