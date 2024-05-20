import React, { useState } from 'react';
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
    password: '',
    confirmPassword: '',
    birthDate: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signupConnection, isLoading, error } = useSignUp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signupConnection(formData.username, formData.email, formData.password, formData.confirmPassword, formData.birthDate);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Header />
      <div className="body">

        <div className={"defaultContainer " + style.SignUp}>
          {isLoading ? (
            <div className='spinner'></div>
          ) : (
            <>
              <h1><b>Registo</b></h1>
              <form className={style.form} onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className='defaultInput'
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className='defaultInput'
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className='defaultInput'
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={handleTogglePassword}
                    className={style.eyeIcon}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className='defaultInput'
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={handleTogglePassword}
                    className={style.eyeIcon}
                  />
                </div>
                <div>
                  <input
                    type="date"
                    placeholder="Data de nascimento"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className='defaultInput'
                  />
                </div>
                <button type="submit" className={"defaultButton " + style.buttonSubmite} disabled={isLoading}> Submeter </button>
              </form>
              {error && <p className="error">{error}</p>}
              <Link to="/login"><b>Já tens conta! Iniciar sessão aqui.</b></Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
