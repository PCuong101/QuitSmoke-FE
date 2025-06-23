import HomePage from './pages/homePage.jsx'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Survey from './features/Survey/survey.jsx';
import DashBoard from './features/Dashboard/dashBoard.jsx';
import Diary from './features/Diary/diary.jsx';
import Missions from './features/Missions/missions.jsx';
import Ranking from './features/Ranking/ranking.jsx';
import Coach from './features/Coach/coach.jsx';
import Achievement from './features/Achievements/achievement.jsx';
import ServicePackage from './features/ServicePackage/ServicePackage.jsx';
import Login from './pages/login.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';

import Blog from './features/Blog/Blog.jsx';
import ArticleDetail from './features/Articles/ArticleDetail.jsx';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/survey' element={
            
              <Survey />
            
          } />
          <Route path='/' element={
              <HomePage />
          } />
          <Route path='/dashboard' element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          } />
          <Route path='diary' element={
            <PrivateRoute>
              <Diary />
            </PrivateRoute>
          } />
          <Route path='missions' element={
            <PrivateRoute>
            <Missions />
          </PrivateRoute>} />
          <Route path='ranking' element={
            <PrivateRoute>
              <Ranking />
            </PrivateRoute>
          } />
          <Route path='achievement' element={
            <PrivateRoute>
              <Achievement />
            </PrivateRoute>
          } />
          <Route path='service-package' element={
            <PrivateRoute>
              <ServicePackage />
            </PrivateRoute>
          } />
          <Route path='coach' element={
            <PrivateRoute>
              <Coach />
            </PrivateRoute>
          } />
          <Route path='login' element={<Login />} />
          {/* Cấu trúc route cho Blog */}
          <Route path='blog' element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          } />
          <Route path='blog/:slug' element={
            <PrivateRoute>
              <ArticleDetail />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
