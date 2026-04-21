import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuthStore } from "../store/authStore";

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, initialized } = useAuthStore();
  const location = useLocation();

  if (!initialized) {
    return <div className="p-10 text-center text-[#5B6783]">Checking session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
