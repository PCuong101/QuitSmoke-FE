import { useEffect, useState, useCallback } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import useUserId from "../../hooks/useUserId";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./coach.css";
import { useNotifications } from "../../contexts/NotificationContext.jsx";
import { Video } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);

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
  // Sử dụng context để lấy thông tin người dùng
  const { refreshNotifications } = useNotifications();
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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [showViewRatingModal, setShowViewRatingModal] = useState(false);
  const [viewingRating, setViewingRating] = useState(null);
  const [ratedBookingIds, setRatedBookingIds] = useState(new Set());
// Gọi API lấy danh sách coach và lịch rảnh
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

  // Gọi API lấy danh sách feedback của user để kiểm tra booking nào đã được đánh giá
  const fetchUserFeedbacks = useCallback(async () => {
    if (!userId) {
      setRatedBookingIds(new Set());
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/feedbacks/user/${userId}`);
      if (!res.ok) {
        setRatedBookingIds(new Set());
        return;
      }
      const feedbacks = await res.json();
      const ratedIds = new Set(feedbacks.map(feedback => feedback.bookingId));
      console.log("Rated booking IDs:", feedbacks);
      setRatedBookingIds(ratedIds);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách feedback:", err);
      setRatedBookingIds(new Set());
    }
  }, [userId]);
// Gọi API lấy lịch hẹn đã đặt của user, đồng thời trích meetingLink hợp lệ
// Gọi API để lấy danh sách lịch hẹn đã đặt của user hiện tại
// - Gộp luôn việc kiểm tra meetingLink để hiển thị nút "Vào buổi gặp" ở tab "Lịch sử booking"

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
        //  Chỉ cần lịch hẹn đã được đặt và có link là sẽ hiển thị nút.
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
// Khi component mount hoặc userId thay đổi:
// - Gọi API để lấy danh sách chuyên gia và lịch rảnh
// - Gọi API để lấy danh sách các lịch hẹn đã đặt của user
// - Gọi API để lấy danh sách feedback của user
  useEffect(() => {
    fetchCoaches();
    if (userId) {
      fetchBookings();
      fetchUserFeedbacks();
    }
  }, [userId, fetchBookings, fetchUserFeedbacks]);
// Mở modal khi chọn coach, reset triệu chứng và slot
  const openModal = (coach) => setSelected({ coach, symptom: "", slot: null });
  // Đóng modal đặt lịch
  const closeModal = () =>
    setSelected({ coach: null, symptom: "", slot: null });
// Gửi dữ liệu đặt lịch (userId, scheduleId, triệu chứng) đến server
// Gửi yêu cầu đặt lịch đến server, nếu thành công:
// - Gọi ToastContext để hiển thị thông báo
// - Lưu lại slot đã đặt để đánh dấu trên giao diện
// - Làm mới lại danh sách coach và lịch
// - Mở modal xác nhận đặt lịch thành công

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
        // Refresh notifications để lấy thông báo mới từ backend
        refreshNotifications();
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
  // Gọi API PUT để hủy lịch theo bookingId
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

  // Mở modal đánh giá
  const openRatingModal = (booking) => {
    setSelectedBookingForRating(booking);
    setRating(0);
    setRatingComment("");
    setShowRatingModal(true);
  };

  // Đóng modal đánh giá
  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBookingForRating(null);
    setRating(0);
    setRatingComment("");
  };

  // Gửi đánh giá
  const submitRating = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/feedbacks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBookingForRating.bookingId,
          userId: userId,
          coachId: selectedBookingForRating.coachId,
          rating: rating,
          comment: ratingComment,
        }),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi đánh giá");

      alert("Đánh giá của bạn đã được gửi thành công!");
      closeRatingModal();
      await fetchBookings(); // Refresh để cập nhật trạng thái đã đánh giá
      await fetchUserFeedbacks(); // Refresh danh sách feedback
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Gửi đánh giá không thành công. Vui lòng thử lại.");
    }
  };

  // Xem đánh giá đã gửi
  const viewRating = async (bookingId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/feedbacks/get-by-booking/${bookingId}`);
      if (!res.ok) throw new Error("Lỗi khi lấy đánh giá");
      
      const ratingData = await res.json();
      setViewingRating(ratingData);
      setShowViewRatingModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      alert("Không thể tải đánh giá. Vui lòng thử lại.");
    }
  };

  // Đóng modal xem đánh giá
  const closeViewRatingModal = () => {
    setShowViewRatingModal(false);
    setViewingRating(null);
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
          {/* Chuyển giữa 2 tab: Danh sách chuyên gia & Lịch sử booking */}
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
                      {/* Mỗi coach hiển thị avatar, tên, email và khung giờ có sẵn 
                      Nếu slot đã được đặt thì disable, còn nếu được chọn thì highlight*/ }
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
                        {/* 1. Khung giờ có sẵn nằm trong phần này */}
                        {/* Hiển thị khung giờ có sẵn của coach */}
                        <h4 className="availability-label">
                          Khung giờ có sẵn:
                        </h4>
                        {/* 2. Grid các slot nằm riêng */}
                        {/* Hiển thị danh sách các khung giờ có sẵn của coach */}
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
                              {/* Hiển thị ngày và giờ của slot */}
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
            {/* Modal hiển thị khi user chọn coach để đặt lịch mới */}
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
            {/* Hiển thị danh sách các lịch hẹn đã đặt bởi user */}
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
                    const hasRated = ratedBookingIds.has(b.bookingId);
                  // Tính trạng thái của mỗi booking (đã hủy, đã hoàn thành, có thể tham gia,...)
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
                          {/* Nếu buổi họp đang hoạt động, hiện nút “Vào buổi gặp” */}
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
                          {b.status === "FINISHED" && !hasRated && (
                            <button
                              onClick={() => openRatingModal(b)}
                              className="btn-rating"
                            >
                              Đánh giá
                            </button>
                          )}
                          {b.status === "FINISHED" && hasRated && (
                            <button
                              onClick={() => viewRating(b.bookingId)}
                              className="btn-view-rating"
                            >
                              Xem đánh giá
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

        {/* --- PHẦN JSX CHO MODAL --- */}
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

        {/* Modal đánh giá */}
        {showRatingModal && selectedBookingForRating && (
          <div className="modal-overlay">
            <div className="modal-content rating-modal">
              <h3 className="modal-title">
                Đánh giá buổi tư vấn với {selectedBookingForRating.coachName}
              </h3>
              
              <div className="modal-section">
                <p className="modal-label">Chất lượng buổi tư vấn:</p>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-button ${rating >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="rating-text">
                  {rating === 0 && "Chưa chọn"}
                  {rating === 1 && "Rất không hài lòng"}
                  {rating === 2 && "Không hài lòng"}
                  {rating === 3 && "Bình thường"}
                  {rating === 4 && "Hài lòng"}
                  {rating === 5 && "Rất hài lòng"}
                </p>
              </div>

              <div className="modal-section">
                <p className="modal-label">Nhận xét (không bắt buộc):</p>
                <textarea
                  className="rating-comment"
                  placeholder="Chia sẻ trải nghiệm của bạn về buổi tư vấn..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeRatingModal}>
                  Hủy
                </button>
                <button className="btn-confirm" onClick={submitRating}>
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xem đánh giá */}
        {showViewRatingModal && viewingRating && (
          <div className="modal-overlay">
            <div className="modal-content rating-modal">
              <h3 className="modal-title">
                Đánh giá của bạn
              </h3>
              
              <div className="modal-section">
                <p className="modal-label">Chất lượng buổi tư vấn:</p>
                <div className="rating-stars view-only">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-display ${viewingRating.rating >= star ? 'active' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="rating-text">
                  {viewingRating.rating === 1 && "Rất không hài lòng"}
                  {viewingRating.rating === 2 && "Không hài lòng"}
                  {viewingRating.rating === 3 && "Bình thường"}
                  {viewingRating.rating === 4 && "Hài lòng"}
                  {viewingRating.rating === 5 && "Rất hài lòng"}
                </p>
              </div>

              {viewingRating.comment && (
                <div className="modal-section">
                  <p className="modal-label">Nhận xét của bạn:</p>
                  <div className="rating-comment-display">
                    {viewingRating.comment}
                  </div>
                </div>
              )}

              <div className="modal-section">
                <p className="modal-label">Thời gian đánh giá:</p>
                <p className="rating-date">
                  {new Date(viewingRating.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div className="modal-actions">
                <button className="btn-confirm" onClick={closeViewRatingModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Coach;
