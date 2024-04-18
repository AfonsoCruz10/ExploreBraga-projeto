import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import styles from "./UserAccount.module.css";
import { useLogOut } from '../../hooks/useLogOut.jsx';
import { useInfoAccount } from '../../hooks/useInfoAccount.jsx';

function UserAccount() {
    const { logOutConnection } = useLogOut();
    const { useraccountConnect, info, isLoading, error } = useInfoAccount();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOutConnection();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await useraccountConnect();
            } catch (error) {
                console.error('Error fetching useraccount:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleCreateEventClick = () => {
        navigate('/userCreatEvent');
    };

    const handleShowUserEventsClick = () => {
        navigate('/userEvents');
    };
    


    return (
        <>
            <Header />
            <div className="body">
                <div className={styles.userAccount}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : error ? (
                        {error}
                    ) : (
                        <>
                        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                        <h2>User Account</h2>

                        <div className={styles.userInfo}>
                            <p><strong>Username:</strong> {info.username}</p>
                            <p><strong>Email:</strong> {info.email}</p>
                        </div>

                        <button className={styles.createEventButton} onClick={handleCreateEventClick}> Criar Eventos </button>
                        <button className={styles.createEventButton} onClick={handleShowUserEventsClick}> Ver Eventos </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserAccount;
