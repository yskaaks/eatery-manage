// SignIn.tsx
import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import "../../styles/SignUp.css"
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SignInFormInputs } from '../../interface';

const SignIn: React.FC = () => {
  const { register, handleSubmit } = useForm<SignInFormInputs>();
  const [role, setRole] = useState<string>("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  
  const onSubmit = async (data: SignInFormInputs) => {
    const { email, password } = data;
    if (!role) { 
      setMessage("select a role")
      return
    }
    if (!email) { 
      setMessage("enter an email")
      return
    }

    if (!password) { 
      setMessage("enter a password")
      return
    }
    try {
      const success = await login(email, password, role);
      if (success) { 
        setMessage("success"); 
        const loggedInUserRole = localStorage.getItem('role');
        const id = localStorage.getItem('id');
        if(loggedInUserRole === "eatery"){
          navigate(`/restaurant/${id}`); 
        }else{
          navigate("/restaurant/map"); 
        }
      } else { 
        setMessage("failure"); 
      }
    } catch { 
      setMessage("failure"); 
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Welcome Back</h2>
      <span className="signup-sub-title">Sign in to your account or&nbsp;
        <div onClick={() => navigate("/auth/register")} className='title-link'>Sign Up</div>
      </span>

      <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
        <input {...register("email")} placeholder="Email" type="email" className="input-field" />
        <input {...register("password")} placeholder="Password" type="password" className="input-field" />

        <div className="user-type-select">
          <button 
              type="button" 
              onClick={() => { 
                setRole("customer")
              }}
              className={role === "customer" ? 'selected' : ''}>
              I'm a Customer
          </button>
          <button 
              type="button" 
              onClick={() => {
                setRole("eatery")
              }} 
              className={role === "eatery" ? 'selected' : ''}>
              I'm a Restaurant Owner
          </button>
        </div>

        
        <button type="submit" className="submit-button">Sign In</button>

        <div className='forgot-password' onClick={() => navigate("/auth/forgot-password")}>
          <p className='forgot-password-text'>forgot password</p>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
