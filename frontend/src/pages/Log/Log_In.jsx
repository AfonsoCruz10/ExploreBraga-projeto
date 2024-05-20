import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import style from "./Log_In.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLogin } from "../../hooks/useLogin.jsx";

function Log_In() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [remember, setRemember] = useState(false); 
    const [showPassword, setShowPassword] = useState(false);
    const { loginConnection, isLoading, error } = useLogin();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        await loginConnection(formData.email, formData.password, remember);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={"defaultContainer " + style.LogIn}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : (
                        <>
                        <h1><b>Iniciar sessão</b></h1>
                        <form className={style.form} onSubmit={handleLogin}>
                            <div>
                                <input 
                                    type="text"
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
                            <div>
                                <input
                                    type="checkbox"
                                    id="rememberCheckbox"
                                    checked={remember}
                                    onChange={() => setRemember(!remember)}
                                />
                                <label htmlFor="rememberCheckbox">Lembra-me</label>
                            </div>
                            <button type="submit" className="defaultButton"  disabled={isLoading}>Entrar</button>
                        </form>
                        {error && <p className="error">{error}</p>}
                        <Link to="/signup"> <b>Registar conta</b></Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Log_In;
