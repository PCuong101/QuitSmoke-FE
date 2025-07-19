// src/features/Dashboard/dashBoard.jsx (PHIÊN BẢN ĐẦY ĐỦ VÀ ĐÃ SỬA LỖI)

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Droplets, BrainCircuit, Wallet, Pencil, Target } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import ProgressChart from "./ProgressChart";
import { useUser } from "../../contexts/UserContext";
import useHealthList from "../../hooks/useHealthListRealtime";

import './Dashboard.css';

// --- HELPER FUNCTIONS (Không thay đổi) ---
function formatRemaining(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds <= 0) return "Hoàn thành";
  const d = Math.floor(seconds / (3600 * 24));
  if (d > 0) return `${d} ngày`;
  const h = Math.floor(seconds / 3600);
  if (h > 0) return `${h} giờ`;
  const m = Math.floor(seconds / 60);
  if (m > 0) return `${m} phút`;
  return `${seconds} giây`;
}

const formatCurrency = (num) => (num ? Math.round(num).toLocaleString('vi-VN') + ' đ' : '0 đ');


// --- SUB-COMPONENTS (Component con) ---

function WelcomeHeader({ userName }) {
    return (
        <div className="dashboard-header">
            <h1>Xin chào, {userName || 'bạn'}!</h1>
            <p>Hãy cùng xem lại những nỗ lực tuyệt vời của bạn trên hành trình bỏ thuốc lá.</p>
        </div>
    );
}

function HealthMilestoneCard({ item }) {
    const Icon = item.name.includes("Tim") ? Heart : (item.name.includes("Oxy") ? Droplets : BrainCircuit);
    const progress = Math.round(item.progressPercent);

    return (
        <div className="health-card">
            <div className="health-card-progress">
                <CircularProgressbar
                    value={progress}
                    text={`${progress}%`}
                    styles={buildStyles({
                        textColor: '#166534',
                        pathColor: '#16a34a',
                        trailColor: '#dcfce7',
                    })}
                />
            </div>
            <div className="health-card-info">
                <div className="health-card-title">
                    {/* <Icon size={20} className="health-card-icon" /> */}
                    <h4>{item.name}</h4>
                </div>
                <p>Thời gian hồi phục còn lại:</p>
                <strong>{formatRemaining(item.timeRemaining)}</strong>
            </div>
        </div>
    );
}

function SavingsInsightCard() {
    const { userId } = useUser();
    const [savedMoney, setSavedMoney] = useState({});
    const [activeTab, setActiveTab] = useState('total');

    useEffect(() => {
        // Nếu không có userId (đã logout), dọn dẹp state và dừng lại
        if (!userId) {
            setSavedMoney({});
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/quit-plan/${userId}/savings`);
                if (response.ok) {
                    const data = await response.json();
                    setSavedMoney(data);
                } else {
                    setSavedMoney({}); // Nếu lỗi (ví dụ user mới chưa có plan), cũng dọn dẹp
                }
            } catch (error) {
                console.error("Lỗi khi fetch savings:", error);
                setSavedMoney({});
            }
        };

        fetchData();

        // Hàm cleanup: sẽ chạy khi userId thay đổi hoặc component bị unmount
        return () => {
            setSavedMoney({});
        };
    }, [userId]); // Phụ thuộc vào userId
    
    const displayData = {
        total: { label: "Tổng Tiết Kiệm", value: formatCurrency(savedMoney.totalSavings) },
        day: { label: "Mỗi Ngày", value: formatCurrency(savedMoney.moneyPerDay) },
        week: { label: "Mỗi Tuần", value: formatCurrency(savedMoney.moneyPerWeek) },
        month: { label: "Mỗi Tháng", value: formatCurrency(savedMoney.moneyPerMonth) },
        year: { label: "Mỗi Năm", value: formatCurrency(savedMoney.moneyPerYear) },
    };

    return (
        <div className="savings-card">
            <div className="card-header">
                <Wallet size={20} />
                <h4>Phân Tích Tiết Kiệm</h4>
            </div>
            <div className="savings-total">
                <span>{displayData[activeTab]?.label || 'Đang tải...'}</span>
                <h2>{displayData[activeTab]?.value || '0 đ'}</h2>
            </div>
            <div className="savings-tabs">
                {Object.keys(displayData).map(key => (
                    <button 
                        key={key} 
                        className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {displayData[key].label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function QuickActionsCard() {
    return (
        <div className="quick-actions-card">
             <div className="card-header">
                <h4>Hành Động Nhanh</h4>
            </div>
            <Link to="/diary" className="action-item">
                <Pencil size={20} />
                <span>Ghi nhật ký hôm nay</span>
            </Link>
            <Link to="/missions" className="action-item">
                <Target size={20} />
                <span>Kiểm tra nhiệm vụ</span>
            </Link>
        </div>
    );
}


// --- MAIN DASHBOARD COMPONENT (Đã sửa logic) ---
function DashBoard() {
  const { healthList, loading: healthLoading } = useHealthList(); // Custom hook đã được sửa
  const { userId, userName } = useUser();

  
  const [dailyLogs, setDailyLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    // Nếu không có userId (vừa logout), dọn dẹp tất cả state và dừng lại
    if (!userId) {
      setDailyLogs([]);
      setLogsLoading(false); // Quan trọng: dừng trạng thái loading
      return;
    }

    // Khi có userId mới, bắt đầu fetch dữ liệu
    const fetchAllDashboardData = async () => {
      // 1. Lấy tên user
      
      
      // 2. Lấy dữ liệu nhật ký
      setLogsLoading(true);
      try {
        const logsRes = await fetch(`http://localhost:8080/api/user-daily-logs/get-daily-logs/${userId}`);
        if (logsRes.ok) {
          const data = await logsRes.json();
          const sortedData = data.sort((a, b) => new Date(a.logDate) - new Date(b.logDate));
          setDailyLogs(sortedData);
        } else {
            setDailyLogs([]); // Nếu response không ok (e.g. 404), set mảng rỗng
        }
      } catch (error) {
        console.error("Lỗi khi fetch daily logs:", error);
        setDailyLogs([]);
      } finally {
        setLogsLoading(false);
      }
    };

    fetchAllDashboardData();

    // Hàm cleanup: Chạy khi component unmount hoặc userId thay đổi
    return () => {
        setDailyLogs([]);
    }
  }, [userId]); // Phụ thuộc duy nhất vào userId

  // Loading state
  if (healthLoading || logsLoading) {
    return (
        <>
            <NavBar />
            <div style={{textAlign: 'center', marginTop: '50px', minHeight: '60vh'}}>
                <p>Đang tải dữ liệu tổng quan...</p>
            </div>
            <Footer />
        </>
    );
  }

  // Render giao diện
  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <WelcomeHeader userName={userName} />

        <div className="dashboard-grid">
            <div className="main-column">
                {dailyLogs.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h4>Tiến Trình Cai Thuốc (Theo Nhật Ký)</h4>
                        </div>
                        <ProgressChart dailyLogs={dailyLogs} />
                    </div>
                )}
                
                <div className="card">
                    <div className="card-header">
                        <h4>Mục Tiêu Sức Khỏe</h4>
                    </div>
                    <div className="health-grid">
                        {healthList.length > 0 ? (
                            healthList.map((item, idx) => (
                                <HealthMilestoneCard key={idx} item={item} />
                            ))
                        ) : (
                            <p>Không có dữ liệu mục tiêu sức khỏe.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="side-column">
                <SavingsInsightCard />
                <QuickActionsCard />
            </div>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default DashBoard;