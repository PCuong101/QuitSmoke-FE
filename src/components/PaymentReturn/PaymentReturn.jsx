import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

function PaymentReturn() {
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, setRole, role } = useUser();

    const params = new URLSearchParams(location.search);
    const orderInfo = params.get("vnp_OrderInfo");
    // "GoiDichVu-3-abc@gmail.com"

    let planId = null;

    if (orderInfo) {
        const parts = orderInfo.split("-");
        if (parts.length >= 2 && parts[0] === "GoiDichVu") {
            planId = parts[1];
        }
    }



    useEffect(() => {
        async function confirmPayment() {
            const params = new URLSearchParams(location.search);
            const vnp_ResponseCode = params.get("vnp_ResponseCode");
            const vnp_TxnRef = params.get("vnp_TxnRef");
            const vnp_TransactionNo = params.get("vnp_TransactionNo");

            if (vnp_ResponseCode === "00") {
                // Gọi API đăng ký gói
                try {
                    const response = await fetch(`http://localhost:8080/api/subscriptions/subscribe?memberId=${userId}&planId=${planId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId,
                            transactionId: vnp_TransactionNo,
                            txnRef: vnp_TxnRef
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(await response.text());
                    }

                    // Sau khi đăng ký gói thành công, lấy lại dữ liệu user
                    const userResponse = await fetch("http://localhost:8080/api/auth/refresh-session", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (userResponse.ok) {
                        const updatedUser = await userResponse.json();
                        setRole(updatedUser.role); // Cập nhật role nếu cần
                        console.log(role);
                        // Cập nhật context nếu cần
                        // Ví dụ: setUser(updatedUser);
                    } else {
                        console.warn("Không lấy được user sau khi đăng ký gói");
                    }

                    setStatus("success");
                } catch (error) {
                    console.error("Đăng ký gói lỗi:", error);
                    setStatus("register-error");
                }
            } else {
                setStatus("failed");
            }
        }

        confirmPayment();
    }, [location, planId, role, setRole, userId]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            {status === "loading" && <h2>Đang xác nhận thanh toán...</h2>}
            {status === "success" && (
                <>
                    <h2>🎉 Thanh toán thành công và gói dịch vụ đã được kích hoạt!</h2>
                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        style={{
                            backgroundColor: "#16a34a", // xanh lá cây đậm
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "500",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#15803d"} // hover màu đậm hơn
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#16a34a"}
                    >
                        Về trang Dashboard
                    </button>

                </>
            )}
            {status === "register-error" && (
                <>
                    <h2>Thanh toán thành công nhưng lỗi khi kích hoạt gói.</h2>
                    <p>Vui lòng liên hệ hỗ trợ.</p>
                </>
            )}
            {status === "failed" && (
                <>
                    <h2>❌ Thanh toán thất bại hoặc bị hủy.</h2>
                    <button onClick={() => navigate("/service-package")}>Chọn gói khác</button>
                </>
            )}
        </div>
    );
}

export default PaymentReturn;
