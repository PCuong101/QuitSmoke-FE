import './Footer.css';
import { SocialIcon } from 'react-social-icons';
export default function Footer() {
    return (
        <footer className="site-footer">
  <div className="footer-content">
    <div className="footer-brand">
      <span>© 2025 <strong style={{color: "#28a745"}}>QuitSmoking</strong>. All rights reserved.</span>
    </div>
    <div className="footer-links">
      <a href="mailto:pcuong101@gmail.com">Liên hệ</a>
      <a href="#">Chính sách bảo mật</a>
      <a href="#">Điều khoản sử dụng</a>
    </div>
    <div className="footer-social">
      <SocialIcon url="https://facebook.com" />
      <SocialIcon url="https://instagram.com" />
      <SocialIcon url="https://twitter.com" />
    </div>
  </div>
</footer>

    );
}
