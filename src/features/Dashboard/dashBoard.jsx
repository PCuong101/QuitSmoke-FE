import * as icon from "lucide-react";
import { useState, useEffect } from "react";
import { SiOxygen } from "react-icons/si";
import NavBar from "../../components/NavBar/NavBar";
import { useUser } from "../../contexts/UserContext";
import useHealthList from "../../hooks/useHealthListRealtime";

// ... Các phần code khác của Dashboard.jsx giữ nguyên ...
function ImprovedCard(props) {
  return (
    <div className="pulse-card">
      <div className="pulse-header">
        <div className="pulse-title">
          <span className="pulse-icon">
            <props.Icon></props.Icon>
          </span>
          <span>
            <strong>{props.title}</strong>
          </span>
        </div>
      </div>
      <div className="pulse-value">
        {props.value}
        {props.unit}
      </div>
      <div className="pulse-bar">
        <div
          className="pulse-bar-fill"
          style={{ width: `${props.progress}%` }}
        ></div>
      </div>
      <div className="pulse-value">{props.timeRemaining}</div>
    </div>
  );
}

function SavingsCardWithDetail() {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const { userId } = useUser();

  const [savedMoney, setSavedMoney] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(userId);
        const response = await fetch(
          `http://localhost:8080/api/quit-plan/${userId}/savings`
        );
        const savedMoney = await response.json();
        setSavedMoney(savedMoney);
      } catch (error) {
        console.error("Lỗi khi fetch:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <>
      {/* Card chính */}
      <div className="savings-container">
        <h3>Số tiền tiết kiệm</h3>
        <div className="savings-content">
          <div className="savings-left">
            <p className="label">Số tiền đã tiết kiệm</p>
            <p className="value green">{savedMoney.totalSavings} đ</p>
            <button className="detail-button" onClick={handleOpen}>
              Xem chi tiết
            </button>
          </div>
          <div className="savings-right">
            <p className="label">Tiết kiệm trong 1 năm</p>
            <p className="value blue">{savedMoney.moneyPerYear} đ</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>Chi tiết số tiền</h4>
              <icon.X className="close-btn" onClick={handleClose}></icon.X>
            </div>
            <div className="modal-body">
              <div className="modal-left">
                <p>
                  <strong>Số tiền tiết kiệm được</strong>
                </p>
                <p className="green">{savedMoney.totalSavings} đ</p>

                <p>Đã tiêu cho thuốc lá</p>
                <p className="red">{savedMoney.totalSpentOnCigarettes} đ</p>

                <p>Đã tiêu cho liệu pháp thay thế Nicotine</p>
                <p className="orange">{savedMoney.totalSpentOnNrt} đ</p>
              </div>
              <div className="modal-right">
                <p>
                  <strong>Mỗi ngày</strong>
                </p>
                <p>{savedMoney.moneyPerDay} đ</p>

                <p>
                  <strong>Mỗi tuần</strong>
                </p>
                <p>{savedMoney.moneyPerMonth} đ</p>

                <p>
                  <strong>Mỗi tháng</strong>
                </p>
                <p>{savedMoney.moneyPerWeek} đ</p>

                <p>
                  <strong>Mỗi năm</strong>
                </p>
                <p>{savedMoney.moneyPerYear} đ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatRemaining(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds)) return "❓";
  if (seconds <= 0) return "✅ Đã hồi phục";

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(" ");
}

function DashBoard() {
  const { healthList, loading } = useHealthList();

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <NavBar />
      <div id="dashBoard">
        <h2 style={{ textAlign: "left" }}>
          <strong>Tổng Quan</strong>
        </h2>
        <h3 style={{ textAlign: "left" }}>Cải thiện sức khỏe của bạn</h3>
        <div className="ImprovedCardContainer">
          {healthList.map((h, idx) => (
            <ImprovedCard
              key={idx}
              timeRemaining={formatRemaining(h.timeRemaining)}
              title={h.name}
              Icon={idx === 0 ? icon.Heart : SiOxygen}
              value={h.progressPercent}
              unit="%"
              progress={h.progressPercent}
            />
          ))}
        </div>
      </div>
      <div id="savedMoney">
        <SavingsCardWithDetail />
      </div>
    </>
  );
}
export default DashBoard;
