import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

const RequireAuth: React.FC = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "idle") {
    return null;
  }

  if (status === "guest") {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
