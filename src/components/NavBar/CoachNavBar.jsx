// src/components/NavBar/CoachNavBar.jsx (PHIÊN BẢN ĐẦY ĐỦ - ĐÃ CẬP NHẬT)

import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- THÊM IMPORT "Link"
import * as icon from 'lucide-react';
import useLogout from '../../hooks/useLogout';
import { useUser } from '../../contexts/UserContext';

export default function CoachNavBar() {
  const logout = useLogout();
  const navigate = useNavigate();
  const { userId } = useUser();
  
  const [userName, setUserName] = useState("Coach");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    if (userId) {
      const fetchCoachName = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/auth/get-session-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
          });
          if (response.ok) {
            const userData = await response.json();
            setUserName(userData.name);
          }
        } catch (error) {
          console.error("Lỗi khi lấy tên Coach:", error);
        }
      };
      fetchCoachName();
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="coach-navbar">
      <h3 className="navbar-brand" onClick={() => navigate('/coach/dashboard')} style={{cursor: 'pointer'}}>
          <strong>QuitSmoking - Coach Panel</strong>
      </h3>
      
      {/* ================== THÊM CÁC LINK ĐIỀU HƯỚNG TẠI ĐÂY ================== */}
      <div className="coach-nav-links">
        <Link to="/coach/dashboard" className="coach-nav-link">Lịch hẹn</Link>
        <Link to="/coach/blog" className="coach-nav-link">Quản lý Blog</Link>
      </div>
      {/* ====================================================================== */}

      <div style={{ position: 'relative', marginLeft: 'auto' }} ref={userMenuRef}>
        <div
          className="user-menu-trigger"
          onClick={() => setUserMenuOpen(prev => !prev)}
        >
          <icon.UserCircle size={24} />
          <h4 className="user-name">{userName}</h4>
          <icon.ChevronDown size={20} className={`chevron-icon ${userMenuOpen ? 'open' : ''}`} />
        </div>

        {userMenuOpen && (
          <div className="user-dropdown-menu">
            <div
              onClick={logout}
              className="dropdown-item"
            >
              <icon.LogOut size={16} />
              <span>Đăng xuất</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}