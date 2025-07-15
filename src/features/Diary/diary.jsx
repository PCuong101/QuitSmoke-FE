import NavBar from "../../components/NavBar/NavBar"
import { useState, useEffect } from "react";
import './diary.css'
import Footer from "../../components/Footer/Footer"
import { useUser } from "../../contexts/UserContext";
// Một icon 'X' đơn giản bằng SVG để đóng modal
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


function Diary() {

  const getLocalISODateTime = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [formData, setFormData] = useState({
    logDate: getLocalISODateTime(), // "YYYY-MM-DDTHH:mm"
    smokedToday: "false",
    cravingLevel: 0,
    stressLevel: 0,
    mood: "neutral",
    cigarettesSmoked: 1,
    spentMoneyOnCigarettes: 0
  });
  const { userId } = useUser(); // Sử dụng context để lấy userId

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        if (!userId) {
          console.error("Không tìm thấy user");
          return;
        } else {
          const response = await fetch(`http://localhost:8080/api/user-daily-logs/get-daily-logs/${userId}`);
          if (!response.ok) throw new Error("Lỗi khi tải dữ liệu nhật ký");

          const data = await response.json();
          setDiaryEntries(data);
        }
      } catch (error) {
        console.error("Fetch diary entries error:", error);
      }
    };

    fetchDiaryEntries();
  }, []);

  // Ngăn cuộn trang nền khi modal mở
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Đảm bảo giá trị là số cho các input number
    const processedValue = type === 'number' || type === 'range' ? parseFloat(value) : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.smokedToday === "false") {
      formData.cigarettesSmoked = 0; // Nếu không hút thuốc, đặt số điếu hút là 0
    }
    const dataToSend = {
      userId,
      ...formData,
    };
    try {
      const response = await fetch('http://localhost:8080/api/user-daily-logs/create-daily-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        alert("Lỗi khi gửi nhật ký.", response.text());
        throw new Error("Lỗi khi gửi nhật ký");
      }

      // Sau khi gửi thành công, gọi lại GET để cập nhật danh sách
      const updated = await fetch(`http://localhost:8080/api/user-daily-logs/get-daily-logs/${userId}`);
      const updatedData = await updated.json();
      setDiaryEntries(updatedData);

      // Đóng modal và reset form
      setIsModalOpen(false);


      setFormData({
        logDate: getLocalISODateTime(),
        smokedToday: "false",
        cravingLevel: 0,
        stressLevel: 0,
        mood: "neutral",
        cigarettesSmoked: 1,
        spentMoneyOnCigarettes: 0
      });
    } catch (error) {
      console.error("Lỗi khi lưu nhật ký:", error);
      alert("Đã xảy ra lỗi khi gửi nhật ký. Vui lòng thử lại.");
    }
  };


  return (
    <div className="dry-diary-container">
      <NavBar />
      <div className="dry-content">
        <div className="dry-header">
          <h1 className="dry-title">Nhật ký cai thuốc</h1>
          <div className="dry-button-container">
            <button onClick={() => setIsModalOpen(true)} className="dry-add-button">
              Thêm nhật ký
            </button>
          </div>
        </div>
        <div className="dry-history-card">
          <h2 className="dry-subtitle">Lịch sử nhật ký</h2>
          {diaryEntries.length === 0 ? (
            <p className="dry-no-entries">Chưa có nhật ký nào.</p>
          ) : (
            <div className="dry-history-list">
              {diaryEntries.map((entry) => (
                <div key={entry.logID} className="dry-history-item">
                  <div className="dry-history-details">
                    <p className="dry-history-text">
                      <span className="dry-history-date">{new Date(entry.logDate).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Hút thuốc:</span>
                      <span className="dry-history-value" style={{ color: entry.smokedToday === true ? "#ef4444" : "#10b981", fontWeight: 'bold' }}>
                        {entry.smokedToday === true ? "Có" : "Không"}
                      </span>
                    </p>
                    <p className="dry-history-text" hidden={entry.smokedToday === false}>
                      <span className="dry-history-label">Số điếu hút:</span>
                      <span className="dry-history-value" style={{ color: entry.smokedToday === true ? "#ef4444" : "#10b981", fontWeight: 'bold' }}>
                        {entry.cigarettesSmoked}
                      </span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Mức độ thèm:</span>
                      <span className="dry-history-value">{entry.cravingLevel}/10</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Mức độ căng thẳng:</span>
                      <span className="dry-history-value">{entry.stressLevel}/10</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Chi phí NRT:</span>
                      <span className="dry-history-value">{entry.spentMoneyOnNtr.toLocaleString()} VNĐ</span>
                    </p>
                  </div>
                  <p className="dry-history-time">
                    {new Date(entry.logDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="dry-modal-overlay">
          <div className="dry-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="dry-modal-close-button" onClick={() => setIsModalOpen(false)}>
              <CloseIcon />
            </button>
            <h2 className="dry-modal-title">Nhật ký hôm nay</h2>
            <form onSubmit={handleSubmit}>
              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="logDate">Ngày & giờ ghi nhật ký</label>
                <input
                  id="logDate"
                  type="datetime-local"
                  name="logDate"
                  value={formData.logDate}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label">Hôm nay bạn có hút điếu nào không?</label>
                <div className="dry-modal-radio-group">
                  <label className="dry-modal-radio">
                    <input
                      type="radio"
                      name="smokedToday"
                      value="false"
                      checked={formData.smokedToday === "false"}
                      onChange={handleInputChange}
                    />
                    <span className="dry-modal-radio-custom">Không</span>
                  </label>
                  <label className="dry-modal-radio">
                    <input
                      type="radio"
                      name="smokedToday"
                      value="true"
                      checked={formData.smokedToday === "true"}
                      onChange={handleInputChange}
                    />
                    <span className="dry-modal-radio-custom">Có</span>
                  </label>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="cravingLevel">Tâm trạng</label>
                <div className="dry-modal-select">
                  <select
                    id="mood"
                    type=""
                    name="mood"
                    min="0"
                    max="10"
                    value={formData.mood}
                    onChange={handleInputChange}
                    className="dry-modal-input"
                  >
                    <option value="happy">Vui vẻ</option>
                    <option value="relaxed">Thư giãn</option>
                    <option value="neutral">Bình thường</option>
                    <option value="sad">Buồn bã</option>
                    <option value="angry">Tức giận</option>
                    <option value="anxious">Lo lắng</option>
                    <option value="bored">Chán nản</option>
                    <option value="tired">Mệt mỏi</option>
                  </select>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="cravingLevel">Mức độ thèm thuốc</label>
                <div className="dry-modal-range-container">
                  <input
                    id="cravingLevel"
                    type="range"
                    name="cravingLevel"
                    min="0"
                    max="10"
                    value={formData.cravingLevel}
                    onChange={handleInputChange}
                    className="dry-modal-range"
                  />
                  <span className="dry-modal-range-value">{formData.cravingLevel}</span>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="stressLevel">Mức độ căng thẳng</label>
                <div className="dry-modal-range-container">
                  <input
                    id="stressLevel"
                    type="range"
                    name="stressLevel"
                    min="0"
                    max="10"
                    value={formData.stressLevel}
                    onChange={handleInputChange}
                    className="dry-modal-range"
                  />
                  <span className="dry-modal-range-value">{formData.stressLevel}</span>
                </div>
              </div>

              <div className="dry-modal-field" hidden={formData.smokedToday === "false"}>
                <label className="dry-modal-label" htmlFor="cigarettesSmoked">Số điếu thuốc hút trong ngày</label>
                <input
                  id="cigarettesSmoked"
                  type="number"
                  name="cigarettesSmoked"
                  min="1"
                  value={formData.cigarettesSmoked}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label" htmlFor="spentMoneyOnCigarettes">Tổng chi phí cho NRT (Liệu pháp thay thế Nicotine) (VNĐ)</label>
                <input
                  id="spentMoneyOnCigarettes"
                  type="number"
                  name="spentMoneyOnCigarettes"
                  min="0"
                  value={formData.spentMoneyOnCigarettes}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-buttons">
                <button type="button" onClick={() => setIsModalOpen(false)} className="dry-modal-button dry-modal-cancel">
                  Hủy
                </button>
                <button type="submit" className="dry-modal-button dry-modal-save">
                  Lưu nhật ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Diary;