import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftCircle, CalendarCheck2, Check } from "lucide-react";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import './CoachDetail.css';

dayjs.locale('vi');
// Hàm để lấy khoảng thời gian của khung giờ dựa trên nhãn
const getSlotTimeRange = (slotLabel) => {
    if (slotLabel.toLowerCase().includes('sáng')) return 'Sáng (08:00 - 10:00)';
    if (slotLabel.toLowerCase().includes('chiều')) return 'Chiều (14:00 - 16:00)';
    return slotLabel;
};
// Hàm để xác định trạng thái của khung giờ cho quản trị viên
const getSlotStateForAdmin = (schedule) => {
    if (schedule.isPublished) {
        return { className: 'state-published', text: 'Đã công khai' };
    }
    return { className: 'state-unpublished', text: 'Chưa công khai' };
};
// Component hiển thị một ô khung giờ
const SlotCell = ({ schedule, isSelected, onClick }) => {
    if (!schedule) {
        return <div className="slot-card placeholder"></div>;
    }
    const { className, text } = getSlotStateForAdmin(schedule);
    return (
        <div className={`slot-card ${className} ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className="slot-time">{getSlotTimeRange(schedule.slotLabel)}</div>
            <div className="slot-status">{text}</div>
            {isSelected && <div className="selected-tick"><Check size={16}/></div>}
        </div>
    );
};
// Component chính hiển thị chi tiết chuyên gia và lịch làm việc
const CoachDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [coach, setCoach] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState(new Set());

   // Hàm để fetch dữ liệu chuyên gia và lịch làm việc
    const fetchData = async () => {
        setLoading(true);
        try {
            const coachRes = await axios.get(`http://localhost:8080/api/admin/coach/${id}`);
            setCoach(coachRes.data);
            const schedulesRes = await axios.get(`http://localhost:8080/api/bookings/coach/${id}/schedule`);
            const sortedSchedules = schedulesRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setSchedules(sortedSchedules);

        } catch (err) { 
            console.error("!!!!!!!! LỖI TRONG QUÁ TRÌNH FETCH DATA:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, [id]);
    // Hàm xử lý khi người dùng click vào một khung giờ
    const handleSlotClick = (schedule) => {
        if (!schedule || schedule.isPublished) return;
        const newSelectedSlots = new Set(selectedSlots);
        if (newSelectedSlots.has(schedule.scheduleId)) {
            newSelectedSlots.delete(schedule.scheduleId);
        } else {
            newSelectedSlots.add(schedule.scheduleId);
        }
        setSelectedSlots(newSelectedSlots);
    };
    // Hàm xử lý khi người dùng xác nhận công khai các khung giờ đã chọn
    const handleConfirmPublish = async () => {
        if (selectedSlots.size === 0) {
            alert("Vui lòng chọn ít nhất một lịch để công khai.");
            return;
        }
        setIsSubmitting(true);
        const promises = Array.from(selectedSlots).map(scheduleId => {
            return axios.put(`http://localhost:8080/api/schedule/${scheduleId}/publish`);
        });
        try {
            await Promise.all(promises);
            alert(`Đã công khai thành công ${selectedSlots.size} lịch làm việc!`);
            setSelectedSlots(new Set());
            await fetchData();
        } catch (err) {
            console.error("Error publishing schedules:", err);
            alert("Đã xảy ra lỗi trong quá trình công khai lịch.");
        } finally {
            setIsSubmitting(false);
        }
    };
    // Sắp xếp lịch theo ngày và buổi (sáng/chiều)
    const schedulesByDate = useMemo(() => {
        return schedules.reduce((acc, schedule) => {
            const date = schedule.date;
            if (!acc[date]) { acc[date] = {}; }
            if (schedule.slotLabel.toLowerCase().includes('sáng')) {
                acc[date].morning = schedule;
            } else if (schedule.slotLabel.toLowerCase().includes('chiều')) {
                acc[date].afternoon = schedule;
            }
            return acc;
        }, {});
    }, [schedules]);

    
    if (loading) return <p>Đang tải chi tiết chuyên gia...</p>;
    if (!coach) return <p>Không tìm thấy chuyên gia.</p>;

    return (
        <div className="coach-detail-page">
            <div className="page-header">
                <div>
                    <h2>Quản lý lịch - {coach.name}</h2>
                    <p>Chọn các khung giờ để công khai. Các lịch đã công khai sẽ có màu xanh và không thể thay đổi.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    <ArrowLeftCircle size={18} /> Quay lại
                </button>
            </div>
            <div className="card">
                <h3 className="list-title"><CalendarCheck2 size={20} /> Lịch làm việc 14 ngày tới</h3>
                <div className="schedule-grid">
                    <div className="grid-header">
                        <div>Ngày</div>
                        <div>Buổi Sáng</div>
                        <div>Buổi Chiều</div>
                    </div>
                    <div className="grid-body">
                        {Object.keys(schedulesByDate).map(date => {
                            const { morning, afternoon } = schedulesByDate[date];
                            return (
                                <div key={date} className="grid-row">
                                    <div className="date-cell">{dayjs(date).format("dd, DD/MM")}</div>
                                    <SlotCell 
                                        schedule={morning}
                                        isSelected={selectedSlots.has(morning?.scheduleId)}
                                        onClick={() => handleSlotClick(morning)}
                                    />
                                    <SlotCell
                                        schedule={afternoon}
                                        isSelected={selectedSlots.has(afternoon?.scheduleId)}
                                        onClick={() => handleSlotClick(afternoon)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {selectedSlots.size > 0 && (
                    <div className="publish-action-bar">
                        <span>Đã chọn <strong>{selectedSlots.size}</strong> lịch để công khai.</span>
                        <button className="btn btn-primary" onClick={handleConfirmPublish} disabled={isSubmitting}>
                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận công khai'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachDetail;