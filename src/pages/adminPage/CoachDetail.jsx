// src/pages/adminPage/CoachDetail.jsx (PHIÊN BẢN SỬA LỖI FETCH DATA)

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeftCircle, CalendarCheck2, Check } from "lucide-react";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import './CoachDetail.css';

dayjs.locale('vi');

const getSlotTimeRange = (slotLabel) => {
    if (slotLabel.toLowerCase().includes('sáng')) return 'Sáng (08:00 - 10:00)';
    if (slotLabel.toLowerCase().includes('chiều')) return 'Chiều (14:00 - 16:00)';
    return slotLabel;
};

const getSlotStateForAdmin = (schedule) => {
    if (schedule.isPublished) {
        return { className: 'state-published', text: 'Đã công khai' };
    }
    return { className: 'state-unpublished', text: 'Chưa công khai' };
};

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

const CoachDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [coach, setCoach] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedSlots, setSelectedSlots] = useState(new Set());

    // ======================================================================
    // === VIẾT LẠI HOÀN TOÀN HÀM FETCH DATA ĐỂ DEBUG VÀ ĐẢM BẢO ĐÚNG ===
    // ======================================================================
    const fetchData = async () => {
        setLoading(true);
        try {
            // Bước 1: Lấy thông tin cơ bản của Coach
            console.log(`Bắt đầu fetch thông tin coach với ID: ${id}`);
            const coachRes = await axios.get(`http://localhost:8080/api/admin/coach/${id}`);
            setCoach(coachRes.data);
            console.log(">>>>> Bước 1 THÀNH CÔNG: Lấy được thông tin coach:", coachRes.data);

            // Bước 2: Dùng coachId đó để lấy TẤT CẢ lịch của họ
            console.log(`Bắt đầu fetch lịch cho coach ID: ${id}`);
            const schedulesRes = await axios.get(`http://localhost:8080/api/bookings/coach/${id}/schedule`);
            console.log(">>>>> Bước 2 THÀNH CÔNG: Dữ liệu lịch trả về từ API là:", schedulesRes.data);

            // Kiểm tra xem phần tử đầu tiên có 'isPublished' không
            if (schedulesRes.data && schedulesRes.data.length > 0) {
                console.log("Kiểm tra phần tử đầu tiên, có 'isPublished' không?:", 'isPublished' in schedulesRes.data[0]);
            }

            const sortedSchedules = schedulesRes.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setSchedules(sortedSchedules);

        } catch (err) { 
            console.error("!!!!!!!! LỖI TRONG QUÁ TRÌNH FETCH DATA:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    useEffect(() => { fetchData(); }, [id]);

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

    // ... phần return JSX giữ nguyên ...
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