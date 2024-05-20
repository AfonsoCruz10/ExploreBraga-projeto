import React, { useState, useEffect } from 'react';
import styles from "./UserAccount.module.css";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from 'react-router-dom';
import { useLogOut } from '../../hooks/useLogOut.jsx';
import { useInfoAccount } from '../../hooks/useInfoAccount.jsx';
import { FaEdit, FaUser, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Footer from "../../components/Footer/Footer.jsx";

function UserAccount() {
    const { logOutConnection } = useLogOut();
    const { useraccountConnect, updateUserInfo, info, isLoading, error, errorNewEmail, errorNewUsername } = useInfoAccount();
    const navigate = useNavigate();
    const [editingField, setEditingField] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [NewProfileImage, setNewProfileImage] = useState(null);
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

    useEffect(() => {
        setNewProfileImage(info.ProfileImage);
    }, [info.ProfileImage]);

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                const base64 = fileReader.result;
                resolve(base64);
            };
            fileReader.onerror = (error) => {
                console.error('Error converting image to base64:', error);
                reject(error);
            };
        });
    };

    const handleCreateEventClick = () => {
        navigate('/userCreatEvent');
    };

    const handleShowUserEventsClick = () => {
        navigate('/userEvents');
    };

    const handleEditUsername = () => {
        setEditingField(editingField === 'username' ? null : 'username');
    };

    const handleEditEmail = () => {
        setEditingField(editingField === 'email' ? null : 'email');
    };

    const handleEditImage = () => {
        setEditingField(editingField === 'image' ? null : 'image');
    };

    const handleImageChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (file instanceof Blob || file instanceof File) {
                const base64 = await convertImageToBase64(file);
                setNewProfileImage(base64);
            } else {
                console.error('Invalid file type.');
            }
        } catch (error) {
            console.error('Error converting image to base64:', error);
        }
    };

    const handleRemoveImage = () => {
        setNewProfileImage(null);
    };

    const handleSaveChanges = async () => {
        try {
            await updateUserInfo(newUsername, newEmail, NewProfileImage);
        } catch (error) {
            console.error('Error UpdateAccount:', error);
        }
        setEditingField(null);
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={"defaultContainer " + styles.userAccount}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <>
                            <div className={styles.botoesPequenosWrapper}>
                                <button className={styles.redButton} onClick={handleLogout}>Logout</button>
                                {info.AdminPermission && <button className={styles.redButton} onClick={() => navigate("/adminPage")}>Gestão Admin</button>}
                            </div>

                            <div className={styles.avatarWrapper}>

                                {editingField === 'image' ? (
                                    <>
                                        <div className={styles.botoesimagem}>
                                            <FaArrowLeft className={styles.backIcon} onClick={handleEditImage} />
                                            <FaTimes className={styles.removeIcon} onClick={handleRemoveImage} />
                                        </div>

                                        <label className={styles.avatarLabel} style={{ cursor: 'pointer' }}>
                                            {NewProfileImage ?
                                                <img src={NewProfileImage} alt="Avatar do usuário" />
                                                : <FaUser className={styles.defaultAvatar} />
                                            }
                                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                                        </label>
                                        <button type="submit" disabled={isLoading} onClick={handleSaveChanges} className={"defaultButton " + styles.submitButton} > Salvar </button>
                                    </>
                                ) : (
                                    <>
                                        <label className={styles.avatarLabel}>
                                            {NewProfileImage ?
                                                <img src={NewProfileImage} alt="Avatar do usuário" />
                                                : <FaUser className={styles.defaultAvatar} />
                                            }
                                            <span className={styles.editText} onClick={handleEditImage}><b>Mudar</b> <FaEdit style={{ marginLeft: '5px' }} /></span>
                                        </label>
                                    </>
                                )}
                            </div>

                            <h2>{info.AdminPermission ? 'Admin' : 'User'} Account</h2>

                            <div className={styles.userInfo}>
                                <div>
                                    <p>
                                        <strong>Username:</strong>
                                        {editingField === 'username' ? (
                                            <>
                                                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className={styles.inputField} />
                                                <button type="submit" disabled={isLoading} onClick={handleSaveChanges} className={"defaultButton " + styles.submitButton} > Salvar </button>
                                            </>
                                        ) : <span style={{ marginLeft: '10px' }}>{info.username}</span>}
                                        <FaEdit onClick={handleEditUsername} className={styles.editIcon} />
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
                                                <button type="submit" disabled={isLoading} onClick={handleSaveChanges} className={"defaultButton " + styles.submitButton} > Salvar </button>
                                            </>
                                        ) : <span style={{ marginLeft: '10px' }}>{info.email}</span>}
                                        <FaEdit onClick={handleEditEmail} className={styles.editIcon} />
                                        <br />
                                        {errorNewEmail && <span className="error">{errorNewEmail}</span>}
                                    </p>
                                </div>

                                <p><strong>Data de Nascimento:</strong> {birthDate} ({age} anos)</p>
                            </div>

                            <button className={"defaultButton " + styles.EventsButton} onClick={handleShowUserEventsClick}> Ver Eventos </button>
                            <button className={"defaultButton " + styles.EventsButton} onClick={handleCreateEventClick}> Criar Eventos </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UserAccount;
