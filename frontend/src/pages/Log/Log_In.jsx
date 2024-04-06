import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import style from "./Log_In.module.css";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Log_In() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5555/users/login', { email, password });
            if (response.status === 200) {
                console.log(`Login bem sucedido!`);
            }
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Header />
            <div className={style.LogIn}>
                <h1>Login</h1>
                <div>
                    <input 
                        type="text"
                        placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        onClick={handleTogglePassword}
                        style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    />
                </div>
                <button onClick={handleLogin}>Login</button>
                {error && <p className={style.error}>{error}</p>}
                <Link to="/signup">Create User</Link>
            </div>
        </>
    );
}

export default Log_In;
