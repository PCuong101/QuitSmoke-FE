// src/App.jsx (PHIÊN BẢN ĐÃ GỘP - HOÀN CHỈNH)

import HomePage from "./pages/homePage.jsx";
import "./styles/App.css";
import "./pages/adminPage/AdminPage.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Survey from "./features/Survey/survey.jsx";
import DashBoard from "./features/Dashboard/dashBoard.jsx";
import Diary from "./features/Diary/diary.jsx";
import Missions from "./features/Missions/missions.jsx";
import Ranking from "./features/Ranking/ranking.jsx";
import Coach from "./features/Coach/coach.jsx";
import Achievement from "./features/Achievements/achievement.jsx";
import ServicePackage from "./features/ServicePackage/ServicePackage.jsx";
import Login from "./pages/login.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Blog from "./features/Blog/Blog.jsx";
import ArticleDetail from "./features/Articles/ArticleDetail.jsx";
import AdminPanel from "./pages/adminPage/AdminPanel.jsx";
import CreateCoachPage from "./pages/adminPage/CreateCoachPage.jsx";
import DashboardAdmin from "./pages/adminPage/DashboardAdmin.jsx";
import UserManagement from "./pages/adminPage/UserManagement.jsx";
import CoachManagement from "./pages/adminPage/CoachManagement.jsx";
import BlogManagement from "./pages/adminPage/BlogManagement.jsx";
import CoachDetail from "./pages/adminPage/CoachDetail.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";

// ================== IMPORTS CHO CÁC TRANG CỦA COACH ==================
import CoachDashboardPage from "./pages/coachPage/CoachDashboardPage.jsx";
import CoachBlogManagementPage from "./pages/CoachBlogManagementPage.jsx";
// =====================================================================

// ================== IMPORTS THÊM TỪ FILE CỦA BẠN ==================
import DashboardWebsocket from "./features/Dashboard/dashBoard.jsx";
import Profile from "./features/Profile/Profile.jsx";
// ===================================================================

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* === CÁC ROUTE CÔNG KHAI === */}
          <Route path="/survey" element={<Survey />} />
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<Login />} />
          
          {/* === ROUTE TEST (từ file của bạn) === */}
          <Route path="/test" element={<DashboardWebsocket />} />

          {/* === CÁC ROUTE CHO MEMBER === */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="diary"
            element={
              <PrivateRoute>
                <Diary />
              </PrivateRoute>
            }
          />
          <Route
            path="missions"
            element={
              <PrivateRoute>
                <Missions />
              </PrivateRoute>
            }
          />
          <Route
            path="ranking"
            element={
              <PrivateRoute>
                <Ranking />
              </PrivateRoute>
            }
          />
          <Route
            path="achievement"
            element={
              <PrivateRoute>
                <Achievement />
              </PrivateRoute>
            }
          />
          <Route
            path="service-package"
            element={
              <PrivateRoute>
                <ServicePackage />
              </PrivateRoute>
            }
          />
          <Route
            path="coach"
            element={
              <PrivateRoute>
                <Coach />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* === CÁC ROUTE CHO BLOG (USER) === */}
          <Route
            path="blog"
            element={
              <PrivateRoute>
                <Blog />
              </PrivateRoute>
            }
          />
          {/* Giữ cả 2 format route cho blog để tương thích */}
          <Route
            path="blog/:slug"
            element={
              <PrivateRoute>
                <ArticleDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="blog/:id"
            element={
              <PrivateRoute>
                <ArticleDetail />
              </PrivateRoute>
            }
          />

          {/* === CÁC ROUTE DÀNH RIÊNG CHO COACH === */}
          <Route
            path="/coach/dashboard"
            element={
              <PrivateRoute>
                <CoachDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/coach/blog"
            element={
              <PrivateRoute>
                <CoachBlogManagementPage />
              </PrivateRoute>
            }
          />

          {/* === CÁC ROUTE DÀNH CHO ADMIN === */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardAdmin />} />
            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="coaches"
              element={
                <PrivateRoute>
                  <CoachManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="posts"
              element={
                <PrivateRoute>
                  <BlogManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="create-coach"
              element={
                <PrivateRoute>
                  <CreateCoachPage />
                </PrivateRoute>
              }
            />
            <Route
              path="coach/:id"
              element={
                <PrivateRoute>
                  <CoachDetail />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;