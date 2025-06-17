import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading/Loading";

export default function PublicRoute({ children }) {
  const { user, isLoading } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      toast.info("You are already logged in");
    }
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
}
