import { useState, useEffect, useRef, use } from "react";
import NavBar from "../../components/NavBar/NavBar"
import { Check, LoaderCircle, History } from 'lucide-react';
import ToastNotification from '../../components/ToastNotification/ToastNotification'; // <-- IMPORT COMPONENT MỚI
import Footer from "../../components/Footer/Footer";
import useUserId from "../../hooks/useUserId";
import { getIconByTemplateId } from './mock-missions-icon';
import './Missions.css';

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
                onClick={() => onComplete(mission.templateID)}
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
    const userId = useUserId();
    console.log("User ID:", userId); // Kiểm tra xem userId có được lấy đúng không
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8080/api/tasks/${userId}`); // thay URL nếu khác
                const data = await response.json();

                setTodayMissions(data);
                const initialCompletions = {};
                data.forEach(mission => {
                    initialCompletions[mission.templateID] = mission.completed;
                });

                setCompletionsMap(initialCompletions);

                const completedCount = data.filter(m => m.completed).length;
                setTotalCompleted(completedCount);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu nhiệm vụ:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            if (notificationTimer.current) clearTimeout(notificationTimer.current);
        };
    }, [userId]); // Thêm userId vào dependency array để fetch lại khi userId thay đổi


    const handleCompleteMission = async (templateID) => {
        if (completionsMap[templateID]) return;

        try {
            const res = await fetch(`http://localhost:8080/api/tasks/complete/${userId}/${templateID}`, {
                method: 'POST'
            });

            if (!res.ok) throw new Error("Không thể hoàn thành nhiệm vụ");

            // Cập nhật UI
            setCompletionsMap(prev => ({ ...prev, [templateID]: true }));
            setTotalCompleted(prev => prev + 1);

            const mission = todayMissions.find(m => m.templateID === templateID);
            if (mission) {
                if (notificationTimer.current) clearTimeout(notificationTimer.current);
                setNotification({ show: true, message: `Hoàn thành: "${mission.title}"` });

                notificationTimer.current = setTimeout(() => {
                    setNotification({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            console.error("Lỗi hoàn thành nhiệm vụ:", error);
            setNotification({ show: true, message: "Lỗi khi hoàn thành nhiệm vụ" });
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
            {/* --- Phần layout chính của trang --- */}
            <div className={`missions-page ${isLoading ? 'loading' : ''}`}>
                

            {/* Đặt component thông báo ở đây, bên ngoài layout chính */}
            <ToastNotification
                show={notification.show}
                message={notification.message}
            />
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
                                {todayMissions.map(mission => {
                                    const Icon = getIconByTemplateId(mission.templateID);

                                    return (
                                        <MissionItem
                                            key={mission.templateID}
                                            mission={{ ...mission, icon: Icon }}
                                            isCompleted={completionsMap[mission.templateID]}
                                            onComplete={handleCompleteMission}
                                        />
                                    );
                                })}

                            </div>
                        </section>
                    </>
                )}
                <Footer></Footer>
            </div>
            
        </>
    );
}

export default Missions;