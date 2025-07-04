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
import PaymentReturn from "./components/PaymentReturn/PaymentReturn.jsx";

// ================== IMPORTS CHO CÁC TRANG CỦA COACH ==================
import CoachDashboardPage from "./pages/coachPage/CoachDashboardPage.jsx";
import CoachBlogManagementPage from "./pages/CoachBlogManagementPage.jsx";
// =====================================================================

// ================== IMPORTS THÊM TỪ FILE CỦA BẠN ==================
import DashboardWebsocket from "./features/Dashboard/dashBoard.jsx";
import Profile from "./features/Profile/Profile.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
// ===================================================================

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* === CÁC ROUTE CÔNG KHAI === */}
          <Route path="/survey" element={
            <PublicRoute>
                <Survey />
            </PublicRoute>
            } />
          <Route path="/" element={
            <PublicRoute>
                <HomePage />
            </PublicRoute>
          } />
          <Route path="login" element={
            <PublicRoute>
                <Login />
            </PublicRoute>
          } />
          
          {/* === ROUTE TEST (từ file của bạn) === */}
          <Route path="/test" element={<DashboardWebsocket />} />

          {/* === CÁC ROUTE CHO MEMBER === */}
          <Route path="/payment-return" element={
            <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <PaymentReturn />
            </PrivateRoute>
          } />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <DashBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="diary"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <Diary />
              </PrivateRoute>
            }
          />
          <Route
            path="missions"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <Missions />
              </PrivateRoute>
            }
          />
          <Route
            path="ranking"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}> 
                <Ranking />
              </PrivateRoute>
            }
          />
          <Route
            path="achievement"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <Achievement />
              </PrivateRoute>
            }
          />
          <Route
            path="service-package"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <ServicePackage />
              </PrivateRoute>
            }
          />
          <Route
            path="coach"
            element={
              <PrivateRoute allowedRoles={["MEMBER_VIP1"]}>
                <Coach />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* === CÁC ROUTE CHO BLOG (USER) === */}
          <Route
            path="blog"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <Blog />
              </PrivateRoute>
            }
          />
          {/* Giữ cả 2 format route cho blog để tương thích */}
          <Route
            path="blog/:id"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <ArticleDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="blog/:id"
            element={
              <PrivateRoute allowedRoles={["MEMBER", "MEMBER_VIP1"]}>
                <ArticleDetail />
              </PrivateRoute>
            }
          />

          {/* === CÁC ROUTE DÀNH RIÊNG CHO COACH === */}
          <Route
            path="/coach/dashboard"
            element={
              <PrivateRoute allowedRoles={["COACH"]}>
                <CoachDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/coach/blog"
            element={
              <PrivateRoute allowedRoles={["COACH"]}>
                <CoachBlogManagementPage />
              </PrivateRoute>
            }
          />

          {/* === CÁC ROUTE DÀNH CHO ADMIN === */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminPanel />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardAdmin />} />
            <Route
              path="dashboard"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="users"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="coaches"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <CoachManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="posts"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <BlogManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="create-coach"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <CreateCoachPage />
                </PrivateRoute>
              }
            />
            <Route
              path="coach/:id"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
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