import { useState, useEffect, useCallback } from "react";
import CoachNavBar from "../../components/NavBar/CoachNavBar";
import Footer from "../../components/Footer/Footer";
import useUserId from "../../hooks/useUserId";
import "./CoachDashboardPage.css";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

import "dayjs/locale/vi";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(updateLocale);
dayjs.locale("vi");

function formatDateWithWeekday(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

// Hàm này sẽ trả về khoảng thời gian tương ứng với nhãn slot
const getSlotTimeRange = (slotLabel) => {
    // Kiểm tra xem chuỗi có chứa "sáng" hoặc "chiều" không (không phân biệt hoa thường)
    if (slotLabel.toLowerCase().includes('sáng')) {
        return 'Sáng (08:00 - 10:00)'; // Cập nhật đúng giờ theo DB của bạn
    }
    if (slotLabel.toLowerCase().includes('chiều')) {
        return 'Chiều (14:00 - 16:00)'; // Cập nhật đúng giờ theo DB của bạn
    }
    // Trả về chính label nếu không khớp
    return slotLabel;
};

function CoachDashboardPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("schedule");
  const userId = useUserId();

const fetchCoachSchedules = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/bookings/coach/${userId}/published-schedule`
      );
      if (!response.ok)
        throw new Error("Lỗi khi tải dữ liệu lịch hẹn của coach");
      const data = await response.json();
      const sortedData = data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSchedules(sortedData); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
}, [userId]);
      
  const handleFinishBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn đánh dấu cuộc hẹn này là đã hoàn thành?")) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}/finish`, { method: "PUT" }
      );
      if (!response.ok) throw new Error("Không thể hoàn thành cuộc hẹn.");
      alert("Đã cập nhật trạng thái thành FINISHED!");
      await fetchCoachSchedules();
    } catch (error) {
      console.error("Lỗi khi hoàn thành booking:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchCoachSchedules();
  }, [userId, fetchCoachSchedules]);

const today = dayjs().startOf("day");

const activeBookings = schedules.filter(
  (s) =>
    s.bookingStatus === "BOOKED" &&
    dayjs(s.date).isSameOrAfter(today)
);

const schedulesUpcoming = schedules.filter(s => dayjs(s.date).isSameOrAfter(today));


const pastBookings = schedules.filter(
  (s) =>
    s.bookingStatus === "FINISHED" ||
    s.bookingStatus === "CANCELED" ||
    (s.bookingStatus === "BOOKED" && dayjs(s.date).isBefore(today))
);

  const renderScheduleList = (bookings) => {
    if (bookings.length === 0) {
      return <p>Không có lịch hẹn nào trong mục này.</p>;
    }
    return bookings.map((schedule) => (
      <div key={schedule.scheduleId} className="schedule-card">
        <div className="card-header">
          <span className="date-tag">
            {dayjs(schedule.date).format("dd, DD/MM/YYYY")}
          </span>
          {schedule.bookingStatus && schedule.bookingStatus !== "UNKNOWN" && (
            <span className={`status-tag status-${schedule.bookingStatus.toLowerCase()}`}>
              {schedule.bookingStatus}
            </span>
          )}
        </div>
        <div className="card-body">
            <p><strong>Slot:</strong>{getSlotTimeRange(schedule.slotLabel)}</p>
            {schedule.bookedByName ? (
            <>
              <p><strong>Người đặt:</strong> {schedule.bookedByName} ({schedule.bookedByEmail})</p>
              <p><strong>Triệu chứng:</strong> {schedule.notes || "Không có ghi chú"}</p>
            </>
            ) : (
            <p><i>Thông tin người đặt không có sẵn.</i></p>
            )}
        </div>
        <div className="card-actions">
          <button
            className="btn-action btn-meet"
            onClick={() => {
              if (schedule.bookingStatus === "BOOKED" && schedule.meetingLink) {
                window.open(schedule.meetingLink, "_blank", "noopener,noreferrer");
              } else {
                alert("Không có link Google Meet cho lịch này!");
              }
            }}
            disabled={schedule.bookingStatus !== "BOOKED" || !schedule.meetingLink}
          >
            Vào buổi gặp
          </button>
          <button
            className="btn-action btn-finish"
            disabled={schedule.bookingStatus !== "BOOKED"}
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
        <div className="availability-container">
          <h2 className="section-title">Tổng quan lịch làm việc</h2>
          <div className="coach-slot-grid">
            {loading ? <p>Đang tải lịch...</p> : (
              schedulesUpcoming.map((s) => (
                <div key={s.scheduleId} className={`coach-slot ${s.bookingStatus !== "EMPTY" ? "slot-booked" : "slot-available"}`}>
                  <div>{formatDateWithWeekday(s.date)}</div>
                  <div>{getSlotTimeRange(s.slotLabel)}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="tab-navigation">
          <div className={`tab-item ${activeTab === "schedule" ? "active" : ""}`} onClick={() => setActiveTab("schedule")}>
            Lịch làm việc ({activeBookings.length})
          </div>
          <div className={`tab-item ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
            Lịch sử ({pastBookings.length})
          </div>
        </div>
        <div className="tab-content">
          {loading ? <h2>Đang tải...</h2> : (
            <>
              {activeTab === "schedule" && (
                <div className="schedule-list">
                  <h2 className="section-title">Lịch hẹn sắp tới</h2>
                  {renderScheduleList(activeBookings)}
                </div>
              )}
              {activeTab === "history" && (
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