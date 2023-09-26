import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../../styles/SignUp.css";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { ResetPassword } from "../../interface";

const ResetPassword: React.FC = () => {
  const { register, handleSubmit } = useForm<ResetPassword>();
  const { passwordReset: passwordReset } = useAuth();
  // success or failure to signUp/signIn message shown to client
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Get eatry detail from query params
  const resetToken = queryParams.get("token");

  const onSubmit = async (data: ResetPassword) => {
    const { newPassword } = data;
    try {
      const success = await passwordReset(resetToken, newPassword);
      if (success) {
        setMessage("Password reset successful. You can login now!");
        navigate("/auth/login");
      } else {
        setMessage("Failed to reset password");
      }
    } catch {
      setMessage("An error occurred");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input
          {...register("newPassword")}
          placeholder="Input Password"
          type="password"
          className="input-field"
        />

        <button type="submit" className="submit-button">
          Send
        </button>
      </form>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
};

export default ResetPassword;
