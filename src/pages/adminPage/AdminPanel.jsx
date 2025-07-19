

import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  Award,
  LogOut,
  Package,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminPage.css";
import useLogout from "../../hooks/useLogout"; // Hook đăng xuất

const AdminPanel = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 2. GỌI HOOK Ở ĐÂY, KHÔNG GỌI TRONG onClick
  const handleLogout = useLogout(); 

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="admin-panel-container">
      <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <span className="logo-text">QuitSmoke Admin</span>
          <button
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>

        <div className="nav-separator">
          <span className="nav-separator-text">Quản lý</span>
        </div>

        <ul className="nav-menu">
          <li
            className={location.pathname === "/admin" || location.pathname === "/admin/dashboard" ? "active" : ""}
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Bảng điều khiển</span>
          </li>
          <li
            className={isActive("/admin/users") ? "active" : ""}
            onClick={() => navigate("/admin/users")}
          >
            <Users size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Quản lý Người dùng</span>
          </li>
          <li
            className={isActive("/admin/coaches") ? "active" : ""}
            onClick={() => navigate("/admin/coaches")}
          >
            <GraduationCap size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Quản lý Chuyên gia</span>
          </li>
          <li
            className={isActive("/admin/posts") ? "active" : ""}
            onClick={() => navigate("/admin/posts")}
          >
            <FileText size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Quản lý Bài đăng</span>
          </li>
          <li
            className={isActive("/admin/achievements") ? "active" : ""}
            onClick={() => navigate("/admin/achievements")}
          >
            <Award size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Quản lý Thành tựu</span>
          </li>

          <li
            className={isActive("/admin/ServicePackagesAdmin") ? "active" : ""}
            onClick={() => navigate("/admin/ServicePackagesAdmin")}
          >
            <Package size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Quản lý Gói thành viên</span>
          </li>
        </ul>
        
        <div className="logout-section">
          {/* 4. SỬA LẠI onClick CHO ĐÚNG */}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Đăng xuất</span>
          </button>
        </div>
      </nav>

      <main className={`main-content ${isCollapsed ? "collapsed" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;