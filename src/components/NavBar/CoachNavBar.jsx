// src/components/NavBar/CoachNavBar.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as icon from 'lucide-react';
import useLogout from '../../hooks/useLogout'; // Sử dụng lại hook logout
import { useUser } from '../../contexts/UserContext'; // Sử dụng hook để lấy thông tin user

export default function CoachNavBar() {
  const logout = useLogout();
  const navigate = useNavigate();
  const { userId } = useUser(); // Lấy userId từ context
  
  const [userName, setUserName] = useState("Coach"); // Giá trị mặc định
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  // Lấy tên của Coach khi có userId
  useEffect(() => {
    if (userId) {
      const fetchCoachName = async () => {
        try {
          // Chúng ta dùng lại API get-session-user vì nó đã có sẵn
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

  // Logic để đóng menu khi click ra ngoài
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
      <h3 className="navbar-brand"><strong>QuitSmoking - Coach Panel</strong></h3>
      
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