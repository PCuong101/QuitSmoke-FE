import { useState } from "react";
import Footer from "../../components/Footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import "./survey.css"; // Import CSS styles
import { toZonedTime, format } from 'date-fns-tz';
import { useUser } from "../../contexts/UserContext.jsx"; // Giả sử bạn có UserContext để lấy userId

function Survey() {

    const { setUserId, setEmail, setUserName } = useUser();

    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    

    const timeZone = 'Asia/Ho_Chi_Minh';
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const todayStr = format(zonedDate, 'yyyy-MM-dd HH:mm:ss.SSS', { timeZone });

    // State cho survey
    const [surveyData, setSurveyData] = useState({
        smokeType: "",
        cigarettesPerDay: "",
        yearsSmoking: "",
        packPrice: "",
        firstSmokeTime: "",
        dateStart:  todayStr,
    });

    // State cho đăng ký
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSurveyChange = (e) => {
        const { name, value } = e.target;
        setSurveyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSurveySubmit = (e) => {
        e.preventDefault();
        setShowRegisterModal(true);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra dữ liệu đăng ký

        if (registerData.password !== registerData.repeatpassword) {
            setErrorMessage("Mật khẩu không khớp.");
            return;
        }
        setErrorMessage(""); // xoá lỗi nếu trước đó có

        const { repeatpassword, ...fullData } = {
            ...surveyData,
            ...registerData,
        };
        console.log("Sending data:", fullData);

        try {
            const response = await fetch("http://localhost:8080/api/survey-register/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // gửi cookie session nếu cần
                body: JSON.stringify(fullData),
            });

            if (response.ok) {
                const data = await response.json();
                alert("Gửi thành công!");
                setShowRegisterModal(false);
                console.log("Đăng ký thành công:", data);
                setUserId(data.userId);
                setEmail(data.email);
                setUserName(data.name);
                navigate("/dashboard");
            } else {
                alert("Gửi thất bại.");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Đã xảy ra lỗi.");
        }
    };

    return (
        <>
            <div id="survey" style={{ position: 'relative' }}>
                <h1 style={{ color: '#16a34a' }}>QuitSmoking</h1>
                <p>Giúp chúng tôi hiểu thói quen của bạn để tạo kế hoạch cai thuốc phù hợp nhất</p>

                <form onSubmit={handleSurveySubmit}>
                    <h2>Bạn thường hút loại thuốc lá nào?</h2>
                    <div style={{ textAlign: 'left' }}>
                        <input type="radio" name="smokeType" value="cigarette" required onChange={handleSurveyChange} />
                        <label>Thuốc lá điếu</label><br />
                        <input type="radio" name="smokeType" value="menthol" onChange={handleSurveyChange} />
                        <label>Thuốc lá bạc hà</label><br />
                        <input type="radio" name="smokeType" value="roll" onChange={handleSurveyChange} />
                        <label>Thuốc lá cuốn tay</label><br />
                        <input type="radio" name="smokeType" value="electronic" onChange={handleSurveyChange} />
                        <label>Thuốc lá điện tử</label><br />
                        <input type="radio" name="smokeType" value="other" onChange={handleSurveyChange} />
                        <label>Khác</label><br />
                    </div>

                    <h2>Bạn hút bao nhiêu điếu mỗi ngày?</h2>
                    <p>Ví dụ: 10 điếu</p>
                    <input className="input-class" type="number" name="cigarettesPerDay" min="0" placeholder="Nhập số điếu" required onChange={handleSurveyChange} />

                    <h2>Bạn đã hút thuốc bao lâu?</h2>
                    <p>Ví dụ: 10 năm</p>
                    <input className="input-class" type="number" name="yearsSmoking" min="0" placeholder="Nhập số năm" required onChange={handleSurveyChange} />

                    <h2>Giá trung bình mỗi gói thuốc mà bạn sử dụng?</h2>
                    <p>Ví dụ: 25000 VND</p>
                    <input className="input-class" type="number" name="packPrice" min="0" placeholder="Nhập giá tiền" required onChange={handleSurveyChange} />

                    <h2>Khi nào hút điếu đầu tiên sau khi ngủ dậy?</h2>
                    <div style={{ textAlign: 'left' }}>
                        <input type="radio" name="firstSmokeTime" value="within 5 minutes" required onChange={handleSurveyChange} />
                        <label>Trong 5 phút</label><br />
                        <input type="radio" name="firstSmokeTime" value="6-30 minutes" onChange={handleSurveyChange} />
                        <label>6-30 phút</label><br />
                        <input type="radio" name="firstSmokeTime" value="after 60 minutes" onChange={handleSurveyChange} />
                        <label>Sau 60 phút</label><br />
                        <input type="radio" name="firstSmokeTime" value="don't smoke" onChange={handleSurveyChange} />
                        <label>Tôi không hút vào buổi sáng</label><br />
                    </div>

                    <h2>Ngày bạn muốn bắt đầu?</h2>
                    <input className="input-class-date" type="datetime-local" name="dateStart" required value={todayStr} readOnly /> <br></br>
                    <div className="button-container">
                        <input type="submit" value="Tiếp tục" />
                    </div>
                    
                </form>

                {showRegisterModal && (
                    <div style={modalStyle}>
                        <div id="modalContent" style={modalContentStyle}>
                            <h2>Đăng ký thành viên</h2>
                            <p>Chỉ còn một bước nữa để bắt đầu hành trình của bạn!</p>
                            <form onSubmit={handleRegisterSubmit}>
                                <input className="input-register" type="text" name="username" placeholder="Tên người dùng" required onChange={handleRegisterChange} /><br />
                                <input className="input-register" type="email" name="email" placeholder="Email" required onChange={handleRegisterChange} /><br />
                                <input className="input-register" type="password" name="password" placeholder="Mật khẩu" required onChange={handleRegisterChange} /><br />
                                <input className="input-register" type="password" name="repeatpassword" placeholder="Nhập lại mật khẩu" required onChange={handleRegisterChange} /><br />
                                <button style={{background:'#16a34a', padding:'10px 30px', margin:'10px auto'}} type="submit">Đăng ký</button>
                                {errorMessage && (
                                    <p style={{ color: "red", fontSize: "0.9rem" }}>{errorMessage}</p>
                                )}
                            </form>
                            <button style={{margin: '10px auto 0'}} onClick={() => setShowRegisterModal(false)}>Đóng</button>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </>
    );
}

const modalStyle = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    width: '400px',
    color: 'black'
};

export default Survey;
