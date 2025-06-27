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
import DashboardWebsocket from "./features/Dashboard/dashBoard.jsx";
import CoachDashboardPage from "./pages/coachPage/CoachDashboardPage.jsx";
import { NotificationProvider } from './contexts/NotificationContext.jsx';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<DashboardWebsocket />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/" element={<HomePage />} />
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
              {/* THÊM ROUTE MỚI CHO COACH DASHBOARD DƯỚI ĐÂY */}
          <Route
            path="/coach/dashboard"
            element={
              <PrivateRoute>
                <CoachDashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="login" element={<Login />} />
          {/* Cấu trúc route cho Blog */}
          <Route
            path="blog"
            element={
              <PrivateRoute>
                <Blog />
              </PrivateRoute>
            }
          />
          <Route
            path="blog/:slug"
            element={
              <PrivateRoute>
                <ArticleDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardAdmin />} />

            {/* main pages */}
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

            {/* child routes of /admin/coaches */}
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
