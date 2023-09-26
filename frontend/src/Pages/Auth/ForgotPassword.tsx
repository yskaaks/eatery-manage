// ForgotPassword.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../../styles/SignUp.css";
import { useAuth } from "../../hooks/useAuth";
import { RegisterFormInputs } from "../../interface";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const { passwordResetRequest: passwordResetRequest } = useAuth();
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<string>("");

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    const { email } = data;
    try {
      const success = await passwordResetRequest(email, role);
      if (success) {
        setMessage("Check your email for the instructions to reset your password");
      } else {
        setMessage("Failed to send reset email");
      }
    } catch {
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input
          {...register("email")}
          placeholder="Send Email"
          type="email"
          className="input-field"
        />

        <div className="user-type-select">
          {" "}
          {/* Add this block for role selection */}
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={role === "customer" ? "selected" : ""}
          >
            I'm a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("eatery")}
            className={role === "eatery" ? "selected" : ""}
          >
            I'm a Restaurant Owner
          </button>
        </div>

        <button type="submit" className="submit-button">
          {loading ? "Loading..." : "Send"}
        </button>
      </form>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
