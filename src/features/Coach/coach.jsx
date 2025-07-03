import { useEffect, useState, useCallback } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import useUserId from "../../hooks/useUserId";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./Coach.css";
import { useNotifications } from "../../contexts/NotificationContext.jsx";
import { Video } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);

// symptoms và formatDateWithWeekday được giữ nguyên
const symptoms = [
  "Thèm thuốc nhiều",
  "Bức rứt khi không hút",
  "Khó tập trung",
  "Mất ngủ",
  "Khác",
];
function formatDateWithWeekday(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function Coach() {
  // --- STATE VÀ HÀM CỦA BẠN ĐƯỢC GIỮ NGUYÊN HOÀN TOÀN ---
  const { addBookingNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("list");
  const [coaches, setCoaches] = useState([]);
  const [selected, setSelected] = useState({
    coach: null,
    symptom: "",
    slot: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState(null);
  const userId = useUserId();
  const [userBookings, setUserBookings] = useState([]);
  const [activeMeetingLinks, setActiveMeetingLinks] = useState(new Map());

  const fetchCoaches = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/schedule/get-schedule"
      );
      if (!response.ok) throw new Error("Lỗi khi lấy danh sách coach");
      const data = await response.json();
      setCoaches(data);
    } catch (error) {
      console.error("Fetch coaches error:", error);
    }
  };

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setUserBookings([]);
      setActiveMeetingLinks(new Map());
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/get-booking/${userId}`);
      if (!res.ok) {
        setUserBookings([]);
        setActiveMeetingLinks(new Map());
        return;
      }
      const data = await res.json();
      setUserBookings(data);

      const activeLinksMap = new Map();
      data.forEach((booking) => {
        // LOGIC MỚI: Chỉ cần lịch hẹn đã được đặt và có link là sẽ hiển thị nút.
        // Thêm kiểm tra booking.meetingLink !== "string" để phòng trường hợp dữ liệu rác.
        if (booking.status === "BOOKED" && booking.meetingLink && booking.meetingLink !== "string") {
          activeLinksMap.set(booking.coachId, booking.meetingLink);
        }
      });
      setActiveMeetingLinks(activeLinksMap);

    } catch (err) {
      console.error("Lỗi khi lấy lịch người dùng:", err);
      setUserBookings([]);
      setActiveMeetingLinks(new Map());
    }
  }, [userId]);

  useEffect(() => {
    fetchCoaches();
    if (userId) {
      fetchBookings();
    }
  }, [userId, fetchBookings]);

  const openModal = (coach) => setSelected({ coach, symptom: "", slot: null });
  const closeModal = () =>
    setSelected({ coach: null, symptom: "", slot: null });

  const confirm = async () => {
    if (!selected.symptom || selected.slot === null) {
      setShowConfirmation(true);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          scheduleId: selected.slot,
          note: selected.symptom,
        }),
      });
      if (!res.ok) throw new Error("Lỗi khi booking");
      const bookedSlotDetails = selected.coach.schedules.find(
        (s) => s.scheduleId === selected.slot
      );
      if (bookedSlotDetails) {
        // GỌI HÀM TỪ CONTEXT, truyền thêm hàm formatDateWithWeekday vào
        addBookingNotification(
          selected.coach.name,
          bookedSlotDetails,
          formatDateWithWeekday
        );
      }

      setConfirmedSlot({ coachId: selected.coach.id, slot: selected.slot });

      const refreshed = await fetch(
        "http://localhost:8080/api/schedule/get-schedule"
      );
      const refreshedData = await refreshed.json();
      setCoaches(refreshedData);

      await fetchBookings();
      setShowConfirmation(true);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    if (selected.symptom && selected.slot !== null) {
      closeModal();
      setActiveTab("history");
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/cancel?bookingId=${bookingId}`,
        {
          method: "PUT",
        }
      );
      console.log("Hủy lịch:", { bookingId });
      if (!res.ok) throw new Error("Hủy lịch thất bại");

      await fetchBookings();
      await fetchCoaches();
    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      alert("Hủy lịch không thành công. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <div className="coach-page-container">
        <NavBar />
        <div className="coach-page-content">
          <header className="page-header">
            <h1>Nhờ sự giúp đỡ từ chuyên gia</h1>
            <br></br>
            <p>
              Kết nối với các chuyên gia hàng đầu để nhận tư vấn và hỗ trợ cá
              nhân hóa
            </p>
          </header>

          <div className="tab-navigation">
            <div
              className={`tab-item ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              Danh sách chuyên gia
            </div>
            <div
              className={`tab-item ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Lịch sử booking
            </div>
          </div>

          <div className="tab-content">
            {activeTab === "list" && (
              <div className="coach-list-container">
                {coaches.map((c) => {
                  const meetingLink = activeMeetingLinks.get(c.id);
                  return (
                    <div key={c.id} className="coach-card-detailed">

                      <div className="coach-main-info">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="coach-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://i.pravatar.cc/72";
                          }}
                        />
                        <div className="coach-details">
                          <div className="coach-header">
                            <h3 className="coach-name">{c.name}</h3>
                            <p className="coach-email">{c.email}</p>
                            
                          </div>
                        </div>
                        

                      </div>

                      <div className="coach-availability-section">
                        {" "}
                        {/* Container cha mới */}
                        {/* 1. Nhãn nằm riêng */}
                        <h4 className="availability-label">
                          Khung giờ có sẵn:
                        </h4>
                        {/* 2. Grid các slot nằm riêng */}
                        <div className="coach-slot-grid">
                          {c.schedules.map((s) => (
                            <div
                              key={s.scheduleId}
                              className={`coach-slot ${
                                // Đổi tên class để rõ ràng hơn
                                !s.available
                                  ? "slot-booked"
                                  : confirmedSlot &&
                                    confirmedSlot.coachId === c.id &&
                                    confirmedSlot.slot === s.scheduleId
                                  ? "slot-confirmed"
                                  : ""
                              }`}
                            >
                              {/* Để có 2 dòng, chúng ta dùng thẻ p hoặc div */}
                              <div>
                                {formatDateWithWeekday(s.date).replace(
                                  " ",
                                  ",\u00A0"
                                )}
                              </div>
                              <div>
                                {s.slotLabel === "1" ? "08:00 - 10:00" : "14:00 - 16:00"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nút Booking vẫn nằm ngoài như cũ */}
                      <div className="coach-card-actions">
                        {/* Nút vào buổi gặp sẽ chỉ hiển thị nếu có link */}
                        {/* {meetingLink && (
                          <a
                            href={meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-action btn-join-meet"
                          >
                            <Video size={16} />
                            <span>Vào buổi gặp</span>
                          </a>
                        )} */}

                        <button
                          className="btn-action btn-booking"
                          onClick={() => openModal(c)}
                        >
                          Booking
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selected.coach && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="modal-title">
                    Đặt lịch với {selected.coach.name}
                  </h3>
                  <div className="modal-section">
                    <p className="modal-label">Triệu chứng:</p>
                    <select
                      className="symptom-dropdown"
                      value={selected.symptom}
                      onChange={(e) =>
                        setSelected({ ...selected, symptom: e.target.value })
                      }
                    >
                      <option value="">--Chọn triệu chứng--</option>
                      {symptoms.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-section">
                    <p className="modal-label">Chọn slot (7 ngày × 2 slot):</p>
                    <div className="slot-grid">
                      {selected.coach.schedules.map((s) => (
                        <button
                          key={s.scheduleId}
                          disabled={!s.available}
                          onClick={() =>
                            setSelected({ ...selected, slot: s.scheduleId })
                          }
                          className={`slot-button ${
                            !s.available ? "slot-disabled" : ""
                          } ${
                            selected.slot === s.scheduleId ? "slot-active" : ""
                          }`}
                        >
                          {`${formatDateWithWeekday(s.date)} ${
                            s.slotLabel === "1" ? "Sáng" : "Chiều"
                          }`}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={closeModal}>
                      Hủy
                    </button>
                    <button className="btn-confirm" onClick={confirm}>
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="booking-history-container">
                <div className="booking-history-header">
                  <h2>Lịch sử booking</h2>
                  <p>Xem lại các cuộc hẹn đã đặt với chuyên gia</p>
                </div>
                {userBookings.length === 0 ? (
                  <p style={{ textAlign: "center" }}>
                    Bạn chưa có lịch hẹn nào.
                  </p>
                ) : (
                  userBookings.map((b) => {
                    const meetingEndTime = dayjs(
                      `${b.bookingDate} ${b.endTime}`
                    );
                    const now = dayjs();
                    let meetingStatusLabel = "";
                    let isJoinEnabled = false;

                    if (b.status === "CANCELED") {
                      meetingStatusLabel = "Đã hủy";
                    } else if (b.status === "FINISHED") {
                      meetingStatusLabel = "Đã hoàn thành";
                    } else if (b.status === "BOOKED") {
                      if (now.isAfter(meetingEndTime)) {
                        meetingStatusLabel = "Đã quá hạn";
                      } else {
                        meetingStatusLabel = "Vào buổi gặp";
                        isJoinEnabled = true;
                      }
                    } else {
                      meetingStatusLabel = "Không xác định";
                    }

                    return (
                      <div key={b.bookingId} className="user-booking-card">
                        <div className="booking-info">
                          <p>
                            <strong>Thời gian:</strong>{" "}
                            {formatDateWithWeekday(b.bookingDate)} {b.startTime}{" "}
                            - {b.endTime}
                          </p>
                          <p>
                            <strong>Tên chuyên gia:</strong> {b.coachName}
                          </p>
                          <p>
                            <strong>Trạng thái:</strong> {b.status}
                          </p>
                          <p>
                            <strong>Ghi chú:</strong> {b.note}
                          </p>
                        </div>
                        <div className="booking-actions">
                          {isJoinEnabled ? (
                            <a
                              href={b.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-meet"
                            >
                              {meetingStatusLabel}
                            </a>
                          ) : (
                            <button disabled className="btn-meet btn-disabled">
                              {meetingStatusLabel}
                            </button>
                          )}
                          {b.status === "BOOKED" && (
                            <button
                              onClick={() => cancelBooking?.(b.bookingId)}
                              className="btn-cancel"
                            >
                              Hủy lịch
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- PHẦN JSX CHO MODAL ĐÃ ĐƯỢC ĐIỀN ĐẦY ĐỦ --- */}
        {selected.coach && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">
                Đặt lịch với {selected.coach.name}
              </h3>
              <div className="modal-section">
                <p className="modal-label">Triệu chứng:</p>
                <select
                  className="symptom-dropdown"
                  value={selected.symptom}
                  onChange={(e) =>
                    setSelected({ ...selected, symptom: e.target.value })
                  }
                >
                  <option value="">--Chọn triệu chứng--</option>
                  {symptoms.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-section">
                <p className="modal-label">Chọn slot:</p>
                <div className="slot-grid">
                  {selected.coach.schedules.map((s) => (
                    <button
                      key={s.scheduleId}
                      disabled={!s.available}
                      onClick={() =>
                        setSelected({ ...selected, slot: s.scheduleId })
                      }
                      className={`slot-button ${
                        !s.available ? "slot-disabled" : ""
                      } ${selected.slot === s.scheduleId ? "slot-active" : ""}`}
                    >
                      {`${formatDateWithWeekday(s.date)} (${
                        s.slotLabel === "1" ? "Sáng" : "Chiều"
                      })`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>
                  Hủy
                </button>
                <button className="btn-confirm" onClick={confirm}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-content">
              <h3 className="confirmation-title">
                {selected.symptom && selected.slot !== null
                  ? "Xác nhận đặt lịch"
                  : "Lỗi"}
              </h3>
              <p className="confirmation-message">
                {selected.symptom && selected.slot !== null
                  ? `Đã đặt với ${selected.coach.name}\nTriệu chứng: ${selected.symptom}`
                  : "Vui lòng chọn triệu chứng và slot!"}
              </p>
              <button className="btn-ok" onClick={closeConfirmation}>
                OK
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Coach;
