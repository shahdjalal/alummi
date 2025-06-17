import axios from "axios";
import React, { useEffect, useState } from "react"; // ✅ أضفنا useEffect
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import style from "./register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);
  const [ServerError, setServerError] = useState(null);

  // ✅ إظهار رسالة الخطأ بالتوست
  useEffect(() => {
    if (ServerError) {
      toast.error(ServerError, {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });
      setServerError(null); // نرجّعها null عشان ما تظهر كل مرة
    }
  }, [ServerError]);

  const registerUser = async (value) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name: value.userName,
          email: value.email,
          password: value.password,
        }
      );
      if (response.status === 201) {
        toast.info(" Please check your email!", {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
        
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000); // ✅ خلي المستخدم يشوف التوست أول
        
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setServerError("Email already exists");
      } else {
        setServerError(error.response?.data?.message || "Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <ToastContainer />
        <form
          onSubmit={handleSubmit(registerUser)}
          className={`${style.register}`}
        >
          <h1 className="mb-5">Sign Up</h1>

          {/* الاسم */}
          <FloatingLabel
            controlId="floatingInput"
            label="User Name"
            className={`${style.FloatLabel} mb-3`}
          >
            <Form.Control
              type="text"
              placeholder=" "
              {...register("userName", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className={style.transparentInput}
            />
            {errors.userName && (
              <p className="text-danger">{errors.userName.message}</p>
            )}
          </FloatingLabel>

          {/* الإيميل */}
          <FloatingLabel
            controlId="floatingEmail"
            label="Email address"
            className={`${style.FloatLabel} mb-3`}
          >
            <Form.Control
              type="email"
              placeholder=" "
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={style.transparentInput}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </FloatingLabel>

          {/* كلمة السر */}
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className={`${style.FloatLabel} mb-3`}
          >
            <Form.Control
              type="password"
              placeholder=" "
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) =>
                  /[A-Z]/.test(value) ||
                  "Password must contain at least one uppercase letter",
              })}
              className={style.transparentInput}
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </FloatingLabel>

          {/* تأكيد كلمة السر */}
          <FloatingLabel
            controlId="floatingConfirmPassword"
            label="Confirm Password"
            className={`${style.FloatLabel} mb-3`}
          >
            <Form.Control
              type="password"
              placeholder=" "
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className={style.transparentInput}
            />
            {errors.confirmPassword && (
              <p className="text-danger">{errors.confirmPassword.message}</p>
            )}
          </FloatingLabel>

          <Button
            type="submit"
            variant="primary"
            disabled={IsLoading}
            className={`${style.registerbtn}`}
          >
            {IsLoading ? "Loading..." : "Register"}
          </Button>

          <hr className={`${style.line}`} />

          <FontAwesomeIcon icon={faUser} size="3x" color="black" />
          <h5>You have an account?</h5>
          <p className={`${style.paragraph}`}>
            If you already have an account with us, you can log in to access
            your order status and history.
          </p>

          <Link to={"/auth/login"} className={`${style.link}`}>
            LogIn
          </Link>
        </form>
      </Container>
    </>
  );
}
