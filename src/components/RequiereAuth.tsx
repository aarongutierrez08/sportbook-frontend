import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const RequireAuth: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
