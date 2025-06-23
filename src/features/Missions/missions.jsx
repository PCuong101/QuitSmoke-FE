import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar/NavBar"
import { mockTodayMissionList, mockUserCompletions, mockTaskTemplates } from "./mock-missions";
import { Check, LoaderCircle, History } from 'lucide-react';
import ToastNotification from '../../components/ToastNotification/ToastNotification'; // <-- IMPORT COMPONENT MỚI
import Footer from "../../components/Footer/Footer";

// --- COMPONENT CON: MissionItem giữ nguyên như cũ ---
function MissionItem({ mission, isCompleted, onComplete }) {
    const Icon = mission.icon;
    return (
        <div className={`mission-item ${isCompleted ? 'completed' : ''}`}>
            <div className="mission-item-icon-wrapper">
                <Icon size={24} />
            </div>
            <div className="mission-item-content">
                <h4 className="mission-item-title">{mission.title}</h4>
                <p className="mission-item-description">{mission.description}</p>
            </div>
            <button
                className="mission-item-complete-button"
                onClick={() => onComplete(mission.templateId)}
                disabled={isCompleted}
            >
                {isCompleted ? (
                    <>
                        <Check size={16} />
                        <span>Đã xong</span>
                    </>
                ) : (
                    <span>Hoàn thành</span>
                )}
            </button>
        </div>
    );
}

function Missions() {
    const [todayMissions, setTodayMissions] = useState([]);
    const [completionsMap, setCompletionsMap] = useState({});
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE MỚI ĐỂ ĐIỀU KHIỂN THÔNG BÁO ---
    const [notification, setNotification] = useState({ show: false, message: '' });
    // Dùng useRef để quản lý các bộ đếm thời gian
    const notificationTimer = useRef(null);

    useEffect(() => {
        // ... Logic fetchData giữ nguyên ...
        const fetchData = () => {
            setTodayMissions(mockTodayMissionList);
            const initialCompletions = {};
            mockTodayMissionList.forEach(mission => {
                if (mockUserCompletions.some(c => c.templateId === mission.templateId)) {
                    initialCompletions[mission.templateId] = true;
                } else {
                    initialCompletions[mission.templateId] = false;
                }
            });
            setCompletionsMap(initialCompletions);
            setTotalCompleted(mockUserCompletions.length);
            setIsLoading(false);
        };
        const timer = setTimeout(fetchData, 800);

        // Dọn dẹp khi component unmount
        return () => {
            clearTimeout(timer);
            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
            }
        };
    }, []);

    const handleCompleteMission = (templateId) => {
        if (completionsMap[templateId]) return;

        setCompletionsMap(prev => ({ ...prev, [templateId]: true }));
        setTotalCompleted(prev => prev + 1);
        
        // --- LOGIC MỚI ĐỂ HIỂN THỊ THÔNG BÁO ---
        const mission = todayMissions.find(m => m.templateId === templateId);
        if (mission) {
            // Xóa bộ đếm thời gian cũ nếu có
            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
            }

            // Hiển thị thông báo mới
            setNotification({ show: true, message: `Hoàn thành: "${mission.title}"` });

            // Đặt bộ đếm thời gian để tự động ẩn thông báo sau 3 giây
            notificationTimer.current = setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 3000);
        }
    };

    const completedTodayCount = Object.values(completionsMap).filter(Boolean).length;
    const progressPercentage = todayMissions.length > 0 ? (completedTodayCount / todayMissions.length) * 100 : 0;

    return (
        <>
            {/* Component NavBar của bạn */}
            <NavBar />
            
            {/* Đặt component thông báo ở đây, bên ngoài layout chính */}
            <ToastNotification 
                show={notification.show} 
                message={notification.message} 
            />

            {/* --- Phần layout chính của trang --- */}
            <div className={`missions-page ${isLoading ? 'loading' : ''}`}>
                {isLoading ? (
                    <div className="loading-container">
                        <LoaderCircle className="spinner" size={48} />
                        <p>Đang tải nhiệm vụ...</p>
                    </div>
                ) : (
                    <>
                        <header className="missions-header">
                            <h1>Nhiệm Vụ Hàng Ngày</h1>
                            <div className="total-missions-counter">
                                <History size={20} />
                                <span>Tổng cộng: <strong>{totalCompleted}</strong></span>
                            </div>
                        </header>

                        <section className="today-mission-section">
                            <div className="today-progress-header">
                                <h2>Mục tiêu hôm nay</h2>
                                <span>{completedTodayCount} / {todayMissions.length} đã hoàn thành</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                            
                            <div className="today-mission-list">
                                {todayMissions.map(mission => (
                                    <MissionItem
                                        key={mission.templateId}
                                        mission={mission}
                                        isCompleted={completionsMap[mission.templateId]}
                                        onComplete={handleCompleteMission}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
            <Footer></Footer>
        </>
    );
}

export default Missions;