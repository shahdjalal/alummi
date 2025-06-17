import React, { useState } from 'react';
import { Container, FloatingLabel, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import style from '../register/register.module.css'; // ✅ نفس ستايل تسجيل الدخول
import { useForm } from 'react-hook-form';

export default function SendCode() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
const {
    register,
    formState: { errors },
  } = useForm();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`$${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send reset email");

    toast.info('A reset link has been sent!check your email', {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });

    // تنقليه فورًا إلى صفحة reset-password مع التوكن
    // setTimeout(() => {
    //   navigate(`/auth/reset-password/${data.token}`);
    // }, 2000);

  } catch (error) {
    toast.error(`❌ ${error.message}`, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
  }
};

  return (
    <Container>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={`${style.register}`}>
        <h1 className="mb-4">Forgot Password</h1>

        <p className="mb-4 text-muted">
          Enter your email address and we’ll send you a link to reset your password.
        </p>

      
   <FloatingLabel
               controlId="floatingInput"
               label="Email address"
               className={`${style.FloatLabel} mb-3`}
             >
               <Form.Control
                 type="email"
                 placeholder=" "
                 {...register("email", {
                   required: "Email is required",
                 })}
                   value={email}
            onChange={(e) => setEmail(e.target.value)}
                 className={`${style.transparentInput}`}
               />
               {errors.email && (
               <p className="text-danger">{errors.email.message}</p>
             )}
             </FloatingLabel>
        <Button type="submit" className={style.registerbtn} variant="danger">
          Send Reset Link
        </Button>

        <p className="mt-4">
          <a href="/auth/login" className={style.link}>Back to Login</a>
        </p>
      </form>
    </Container>
  );
}
