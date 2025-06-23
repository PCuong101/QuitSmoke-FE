import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminPanel = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="admin-panel-container">
      <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <span className="logo-text">QuitSmoking Admin</span>
          <button
            className="toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>
        </div>

        {/* Section Header */}
        <div className="nav-separator">
          <span className="nav-separator-text">Quản lý</span>
        </div>

        <ul className="nav-menu">
          <li
            className={isActive("/admin/dashboard") ? "active" : ""}
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
            <span className="nav-item-text">Người dùng</span>
          </li>
          <li
            className={isActive("/admin/coaches") ? "active" : ""}
            onClick={() => navigate("/admin/coaches")}
          >
            <GraduationCap size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Huấn luyện viên</span>
          </li>
          <li
            className={isActive("/admin/posts") ? "active" : ""}
            onClick={() => navigate("/admin/posts")}
          >
            <FileText size={20} strokeWidth={1.5} />
            <span className="nav-item-text">Quản lý bài đăng</span>
          </li>
        </ul>
      </nav>

      <main className={`main-content ${isCollapsed ? "collapsed" : ""}`}>
        <Outlet /> {/* This renders nested admin pages */}
      </main>
    </div>
  );
};

export default AdminPanel;
