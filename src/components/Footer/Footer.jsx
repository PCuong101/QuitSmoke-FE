import './Footer.css'; // Import file CSS thuần
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; 2025 <span className="footer-brand">QuitSmoking</span>. All rights reserved.</p>
                <p>
                    Liên hệ: <a href="mailto:pcuongvn101@gmail.com">pcuongvn101@gmail.com</a>
                </p>
                <div className="footer-links">
                    <a href="/privacy">Chính sách bảo mật</a>
                    <span>|</span>
                    <a href="/terms">Điều khoản sử dụng</a>
                </div>
            </div>
        </footer>
    );
}
