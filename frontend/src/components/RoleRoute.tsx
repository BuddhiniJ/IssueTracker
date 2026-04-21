import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { UserRole } from "../types/auth";

type RoleRouteProps = {
  allowedRoles: UserRole[];
  children: ReactElement;
  redirectTo?: string;
};

export const RoleRoute = ({ allowedRoles, children, redirectTo = "/issues" }: RoleRouteProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
