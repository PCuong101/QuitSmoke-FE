import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(
      "http://localhost:8080/api/auth/get-session-user",
      {},
      { withCredentials: true }
    )
      .then((res) => {
        if (res.data && res.data.userId) {
          setUser(res.data);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user) {
      // Nếu đã đăng nhập, điều hướng theo role
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "COACH") {
        navigate("/coach/dashboard");
      } else if (user.role === "MEMBER" || user.role === "MEMBER_VIP1") {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            fontWeight: "bold",
            color: "#16A34A",
          }}
        >
          <h1>QuitSmoking</h1>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress />
          <h2>Đang kiểm tra đăng nhập...</h2>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, cho render children
  return children;
}

export default PublicRoute;
