import { useEffect, useState, type JSX } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import LoadingComponent from "./Loading";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    apiFetch("/api/auth/verifytoken", {
      method: "POST",        
    })
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        navigate("/login", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingComponent />; // or loader
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
