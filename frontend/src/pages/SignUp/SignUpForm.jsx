import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import style from "./SignUpForm.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useSignUp } from "../../hooks/useSignup.jsx";

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const {signupConnection, isLoading, error} = useSignUp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signupConnection(formData.username, formData.email, formData.password);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <div className="body">

        <div className={style.SignUp}>
          {isLoading ? (
              <div className='spinner'></div>
          ) : (
            <>
            <h1><b>Sign Up</b></h1>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={handleTogglePassword}
                  style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                />
              </div>
              <button type="submit" disabled = {isLoading}> Submit </button>
            </form>
            {error && <p className={style.error}>{error}</p>}
            <Link to="/login" >Already have an account? Login here</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
