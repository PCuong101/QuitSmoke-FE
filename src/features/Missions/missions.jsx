import { useState, useEffect, useRef, use } from "react";
import NavBar from "../../components/NavBar/NavBar"
import { Check, LoaderCircle, History } from 'lucide-react';
import ToastNotification from '../../components/ToastNotification/ToastNotification'; 
import Footer from "../../components/Footer/Footer";
import { getIconByTemplateId } from './mock-missions-icon';
import './Missions.css';
import { useNotifications } from "../../contexts/NotificationContext";
import { useUser } from "../../contexts/UserContext";

// --- COMPONENT : MissionItem  ---
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
//quản lý nhiệm vụ mỗi ngày
function Missions() {
    const [todayMissions, setTodayMissions] = useState([]);
    const [completionsMap, setCompletionsMap] = useState({});
    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalMissionsCompleted, setTotalMissionsCompleted] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '' });
    // Dùng useRef để quản lý các bộ đếm thời gian
    const notificationTimer = useRef(null);
    const { userId } = useUser(); // Sử dụng context để lấy userId
    const { refreshNotifications } = useNotifications();
        // --- Fetch nhiệm vụ hàng ngày ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8080/api/tasks/${userId}`); // thay URL nếu khác
                const data = await response.json();
                const totalCount = await fetch(`http://localhost:8080/api/tasks/completed/${userId}`);
                const totalData = await totalCount.json();
                setTotalMissionsCompleted(totalData.length);
                setTodayMissions(data);
                 // Tạo map: templateID -> completed (true/false)
                const initialCompletions = {};
                data.forEach(mission => {
                    initialCompletions[mission.templateID] = mission.completed;
                });

                setCompletionsMap(initialCompletions);
                // Tính tổng số nhiệm vụ đã hoàn thành
                const completedCount = data.filter(m => m.completed).length;
                setTotalCompleted(completedCount);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu nhiệm vụ:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // Cleanup: xóa timer thông báo nếu component bị huỷ
        return () => {
            if (notificationTimer.current) clearTimeout(notificationTimer.current);
        };
    }, [userId]); // Thêm userId vào dependency array để fetch lại khi userId thay đổi

// Gọi API hoàn thành nhiệm vụ
    const handleCompleteMission = async (templateID) => {
           // Tránh xử lý nếu nhiệm vụ đã hoàn thành
        if (completionsMap[templateID]) return;

        try {
            const res = await fetch(`http://localhost:8080/api/tasks/complete/${userId}/${templateID}`, {
                method: 'POST'
            });

            if (!res.ok) throw new Error("Không thể hoàn thành nhiệm vụ");

            // Cập nhật UI
            setCompletionsMap(prev => ({ ...prev, [templateID]: true }));
            setTotalCompleted(prev => prev + 1);
            // Lấy nhiệm vụ tương ứng
            const mission = todayMissions.find(m => m.templateID === templateID);
            if (mission) {
                // Hiện thông báo hoàn thành
                if (notificationTimer.current) clearTimeout(notificationTimer.current);
                setNotification({ show: true, message: `Hoàn thành: "${mission.title}"` });
                // Tự ẩn sau 3 giây
                notificationTimer.current = setTimeout(() => {
                    setNotification({ show: false, message: '' });
                }, 3000);
                // Gửi vào hệ thống notification toàn app - refresh để lấy thông báo mới từ backend
                refreshNotifications();
            }
        } catch (error) {
            console.error("Lỗi hoàn thành nhiệm vụ:", error);
            setNotification({ show: true, message: "Lỗi khi hoàn thành nhiệm vụ" });
            notificationTimer.current = setTimeout(() => {
                setNotification({ show: false, message: '' });
            }, 3000);
        }
    };


    // Tính toán số nhiệm vụ đã hoàn thành hôm nay và tỷ lệ tiến độ
    const completedTodayCount = Object.values(completionsMap).filter(Boolean).length;
    const progressPercentage = todayMissions.length > 0 ? (completedTodayCount / todayMissions.length) * 100 : 0;

    return (
        <>
            
        
            <NavBar />
            {/*layout chinh của trang*/}
            <div className={`missions-page ${isLoading ? 'loading' : ''}`}>
                

            {/* Đặt component thông báo ở đây */}
            <ToastNotification
                icon={Check}
                show={notification.show}
                message={notification.message}
                color="#16a34a" 
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
                                <span>Tổng cộng: <strong>{totalMissionsCompleted}</strong></span>
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