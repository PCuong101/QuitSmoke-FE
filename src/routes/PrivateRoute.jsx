import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post("http://localhost:8080/api/auth/get-session-user", {}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      const user = res.data;

      if (user && user.userId) {
        setIsAuthenticated(true);
        setUserRole(user.role);

        // Điều hướng theo role
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "MEMBER" || user.role === "MEMBER_VIP1") {
          navigate("/dashboard");
        } else if (user.role === "COACH") {
          navigate("/coach/dashboard");
        }
      } else {
        setIsAuthenticated(false);
      }
    })
    .catch(err => {
      console.error("Không lấy được user từ session:", err);
      setIsAuthenticated(false);
    });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '1.5rem',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#16A34A'
        }}>
          <h1>QuitSmoking</h1>
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <CircularProgress />
          <h2>Vui lòng chờ giây lát...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
