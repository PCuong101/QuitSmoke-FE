import { useState } from "react";
import { Footer } from "./homePage";

function Survey() {
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");


    // State cho survey
    const [surveyData, setSurveyData] = useState({
        smokeType: "",
        cigarettesPerDay: "",
        yearsSmoking: "",
        packPrice: "",
        firstSmokeTime: "",
        dateStart: "",
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

        const fullData = {
            ...surveyData,
            ...registerData,
        };

        try {
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fullData),
            });

            if (response.ok) {
                alert("Gửi thành công!");
                setShowRegisterModal(false);
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
                    <input className="input-class" type="number" name="cigarettesPerDay" min="0" required onChange={handleSurveyChange} />

                    <h2>Bạn đã hút bao lâu?</h2>
                    <input className="input-class" type="number" name="yearsSmoking" min="0" required onChange={handleSurveyChange} />

                    <h2>Giá mỗi gói thuốc?</h2>
                    <input className="input-class" type="number" name="packPrice" min="0" required onChange={handleSurveyChange} />

                    <h2>Khi nào hút điếu đầu tiên sau khi ngủ dậy?</h2>
                    <div style={{ textAlign: 'left' }}>
                        <input type="radio" name="firstSmokeTime" value="within 5 minutes" required onChange={handleSurveyChange} />
                        <label>Trong 5 phút</label><br />
                        <input type="radio" name="firstSmokeTime" value="6-30 minutes" onChange={handleSurveyChange} />
                        <label>6-30 phút</label><br />
                        <input type="radio" name="firstSmokeTime" value="after 60 minutes" onChange={handleSurveyChange} />
                        <label>Sau 60 phút</label><br />
                    </div>

                    <h2>Ngày bạn muốn bắt đầu?</h2>
                    <input className="input-class-date" type="date" name="dateStart" required onChange={handleSurveyChange} /> <br></br>
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
                                <input className="input-register" type="repeatpassword" name="repeatpassword" placeholder="Nhập lại mật khẩu" required onChange={handleRegisterChange} /><br />
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
    width: '35vw',
};

export default Survey;
