import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/check-session", {
      withCredentials: true// gửi cookie session
    })
    .then(res => {
      if (res.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    })
    .catch(err => {
      console.error("Session check failed:", err);
      setIsAuthenticated(false);
    });
  }, []);

  if (isAuthenticated === null) {
    

  return (
<>
      <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo ở đầu trang */}
      <div style={{
        padding: '1.5rem',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#16A34A'
      }}>
        <h1>QuitSmoking</h1>
      </div>

      {/* Phần giữa chứa spinner */}
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
      </>
  )
      
    
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
