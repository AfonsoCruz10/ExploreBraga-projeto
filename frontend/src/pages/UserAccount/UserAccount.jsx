import React, { useState, useEffect } from 'react';
import styles from "./UserAccount.module.css";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from 'react-router-dom';
import { useLogOut } from '../../hooks/useLogOut.jsx';
import { useInfoAccount } from '../../hooks/useInfoAccount.jsx';
import { FaEdit } from 'react-icons/fa';

function UserAccount() {
    const { logOutConnection } = useLogOut();
    const { useraccountConnect, updateUserInfo, info, isLoading, error, errorNewEmail, errorNewUsername } = useInfoAccount();
    const navigate = useNavigate();
    const [editingField, setEditingField] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");

    var todaysDate = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    var birthDate = new Date(info.birthDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    var age = new Date().getFullYear() - new Date(info.birthDate).getFullYear();

    if (new Date().getMonth() < new Date(info.birthDate).getMonth() ||
        (new Date().getMonth() === new Date(info.birthDate).getMonth() && new Date().getDate() < new Date(info.birthDate).getDate())) {
        age--;
    }


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

    const handleEditUsername = () => {
        setEditingField(editingField === 'username' ? null : 'username');
    }

    const handleEditEmail = () => {
        setEditingField(editingField === 'email' ? null : 'email');
    };

    const handleSaveChanges = async () => {
        try {
            await updateUserInfo(newUsername, newEmail);
        } catch (error) {
            console.error('Error UpdateAccount:', error);
        }
        setEditingField(null);
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={styles.userAccount}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <>
                            <div className={styles.botoesPequenosWrapper}>
                                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
                                {info.AdminPermission && <button className={styles.logoutButton} onClick={() => navigate("/adminPage")}>Gestão Admin</button>}
                            </div>
                            <h2>{info.AdminPermission ? 'Admin' : 'User'} Account</h2>

                            <div className={styles.userInfo}>
                                <div>
                                    <p>
                                        <strong>Username:</strong>
                                        {editingField === 'username' ? (
                                            <>
                                                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className={styles.inputField} />
                                                <button type="submit" disabled={isLoading} onClick={handleSaveChanges} className={styles.submitButton} > <strong>Salvar</strong> </button>
                                            </>
                                        ) : <span style={{ marginLeft: '10px' }}>{info.username}</span>}
                                        <FaEdit onClick={handleEditUsername} style={{ marginLeft: '10px' }} />
                                        <br />
                                        {errorNewUsername && <span className="error">{errorNewUsername}</span>}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Email:</strong>
                                        {editingField === 'email' ? (
                                            <>
                                                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={styles.inputField} />
                                                <button type="submit" disabled={isLoading} onClick={handleSaveChanges} className={styles.submitButton} > <strong>Salvar</strong> </button>
                                            </>
                                        ) : <span style={{ marginLeft: '10px' }}>{info.email}</span>}
                                        <FaEdit onClick={handleEditEmail} style={{ marginLeft: '10px' }} />
                                        <br />
                                        {errorNewEmail && <span className="error">{errorNewEmail}</span>}
                                    </p>
                                </div>

                                <p><strong>Data de Nascimento:</strong> {birthDate} ({age} anos)</p>
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
