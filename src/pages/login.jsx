import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include", // gửi cookie session nếu dùng
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                navigate("/dashboard");
            } else {
                setError("Email hoặc mật khẩu không đúng");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối đến máy chủ.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Đăng nhập</h1>
                <p style={styles.subtitle}>Tiếp tục hành trình cai thuốc của bạn</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" style={styles.button}>Đăng nhập</button>
                </form>

                <p style={styles.footerText}>
                    Chưa có tài khoản? <a href="/survey" style={styles.link}>Đăng ký ngay</a>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #f0fdf4, #e0f7ec)"
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem 2.5rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%"
    },
    title: {
        marginBottom: "0.5rem",
        color: "#166534"
    },
    subtitle: {
        marginBottom: "1.5rem",
        fontSize: "0.95rem",
        color: "#555"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
    },
    input: {
        padding: "0.75rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "1rem"
    },
    button: {
        backgroundColor: "#16a34a",
        color: "#fff",
        padding: "0.75rem",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer"
    },
    error: {
        color: "red",
        fontSize: "0.9rem"
    },
    footerText: {
        marginTop: "1rem",
        fontSize: "0.9rem"
    },
    link: {
        color: "#16a34a",
        textDecoration: "none",
        fontWeight: "bold"
    }
};

export default Login;
