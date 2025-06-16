import React, { useState } from 'react';
import { Button, Container, Form, FloatingLabel } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import style from '../register/register.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
const {
    register,
    formState: { errors },
  } = useForm();

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, {
        newPassword,
      });
      toast.success(res.data.message || "✅ Password reset successfully");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ToastContainer />
      <Form onSubmit={handleReset} className={style.register}>
        <h1 className="mb-4">🔐 Reset Password</h1>

  

<FloatingLabel
               controlId="newPassword" label="New Password"
               className={`${style.FloatLabel} mb-3`}
             >
               <Form.Control
                 type="password"
                 placeholder=" "
                 {...register("New Password", {
                   required: "Password is required",
                 })}
                  value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
                 className={`${style.transparentInput}`}
               />
               {errors.email && (
               <p className="text-danger">{errors.email.message}</p>
             )}
             </FloatingLabel>

        <Button type="submit" disabled={isLoading} className={style.registerbtn}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </Form>
    </Container>
  );
}
