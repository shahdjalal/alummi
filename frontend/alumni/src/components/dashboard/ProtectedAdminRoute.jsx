import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Loading from "../loading/Loading"; // لو عندك مكون لودينغ

export default function ProtectedAdminRoute({ children }) {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <Loading />; // أو null مؤقتًا لو ما عندك لودينغ
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
