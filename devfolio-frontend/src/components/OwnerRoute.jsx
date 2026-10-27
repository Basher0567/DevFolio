
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isOwnerLoggedIn } from "../services/auth";

export default function OwnerRoute() {
  const location = useLocation();

  if (!isOwnerLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
