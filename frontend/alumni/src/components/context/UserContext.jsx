import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [successToast, setSuccessToast] = useState(false); // ✅ جديد

  const getUser = async () => {
    const token = localStorage.getItem("userToken");
     if (!token) {
    setLoading(false); // مهم جدًا عشان ما يعلق اللودينغ
    return;
  }

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: token },
      });
      setUser(res.data.user);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, successToast, setSuccessToast }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
