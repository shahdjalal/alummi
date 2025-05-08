import axios from "axios";
import React, { useState } from "react";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import style from "../register/register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [IsLoading, setIsLoading] = useState(false);

  const loginUser = async (value) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/auth/login`,
        value
      );

      const user = response.data.user;

      // ✅ إذا المستخدم غير مفعل
      if (!user.isVerified) {
        toast.warning("⚠️ Please verify your email before logging in.", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
        return;
      }

      // ✅ المستخدم مفعل
      localStorage.setItem("userToken", response.data.token);
      toast.success("✅ Welcome back!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      navigate("/profile");
    } catch (error) {
      const msg = error.response?.data?.message || "";

      if (msg.includes("verify")) {
        toast.warning("⚠️ Please verify your email before logging in.", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
      } else if (error.response?.status === 401 || msg.includes("Invalid")) {
        toast.error("❌ Invalid email or password", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
      } else if (error.response?.status === 404 || msg.includes("not found")) {
        toast.error("❌ No account found with this email", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
      } else {
        toast.error("🚨 Something went wrong", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
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
          onSubmit={handleSubmit(loginUser)}
          className={`${style.register}`}
        >
          <h1 className="mb-5">Sign In</h1>

          {/* الإيميل */}
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
              className={`${style.transparentInput}`}
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
              })}
              className={`${style.transparentInput}`}
            />
            {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
          </FloatingLabel>
          

          <Button
            type="submit"
            variant="primary"
            disabled={IsLoading}
            className={`${style.registerbtn}`}
          >
            {IsLoading ? "Loading..." : "Login"}
          </Button>

          <hr className={`${style.line}`} />

          <FontAwesomeIcon icon={faUser} size="3x" color="black" />
          <h5>Don't have an account yet?</h5>
          <p className={`${style.paragraph}`}>
            Creating an account is quick and easy! By registering, you'll gain
            access to exclusive deals, faster checkout, and the ability to track
            your order history.
          </p>

          <Link to={"/auth/register"} className={`${style.link}`}>
            Register
          </Link>

          <Link to={"/auth/sendcode"} className={`${style.password}`}>
            Forgot your password?
          </Link>
        </form>
      </Container>
    </>
  );
}
