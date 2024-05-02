import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header.jsx";
import { useAdmin } from '../../hooks/useAdmin.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfo } from '@fortawesome/free-solid-svg-icons';
import styles from "./AdminPage.module.css";
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const { adminUsersConnect, adminEventsConnect, adminEventsPendingConnect, adminEventsActiveConnect, eventAction, adminEvents, isLoading, error, errorAction } = useAdmin();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('events'); // Estado para controlar a seção ativa

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeSection === 'events') {
                    await adminEventsConnect();
                } else if (activeSection === 'users') {
                    await adminUsersConnect();
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };
    
        fetchData();
    }, [activeSection]);



    const handleAction = async (eventId, action) => {
        try {
            await eventAction(eventId, action);
            await adminEventsConnect();
        } catch (error) {
            console.error('Error performing action on event:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="body">
                <h2 className="titulo">Administração</h2>
                <div className={styles.adminEventsContainer}>

                    <div className={styles.sectionButtonContainer}>
                        <span
                            className={activeSection === 'events' ? styles.activeButton : styles.sectionButton}
                            onClick={() => setActiveSection('events')}
                        >
                            Eventos
                        </span>
                        <span
                            className={activeSection === 'users' ? styles.activeButton : styles.sectionButton}
                            onClick={() => setActiveSection('users')}
                        >
                            Usuários
                        </span>
                    </div>
                    
                    {/* Seção de eventos pendentes*/}
                    {activeSection === 'events' && (
                        <>
                            {isLoading ? (
                                <div className='spinner'></div>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : adminEvents.length !== 0 ? (
                                <table className={styles.eventTable}>
                                    {/* Cabeçalho da tabela */}
                                    <thead>
                                        <tr>
                                            <th>Nome do Evento</th>
                                            <th>Tipo</th>
                                            <th>Data de Início/fim</th>
                                            <th>Estado</th>
                                            <th>Username</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    {/* Corpo da tabela */}
                                    <tbody>
                                        {adminEvents.map(event => (
                                            <tr key={event._id}>
                                                <td>{event.Name}</td>
                                                <td>{event.Type}</td>
                                                <td>{new Date(event.BegDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date(event.EndDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                <td>{event.Status}</td>
                                                <td>{event.username}</td>
                                                <td>
                                                    {/* Botões de ação */}
                                                    <button onClick={() => handleAction(event._id, 'accept')} className={styles.buttonAccept}>
                                                        <FontAwesomeIcon icon={faCheck} /> Aceitar
                                                    </button>
                                                    <button onClick={() => handleAction(event._id, 'pending')} className={styles.buttonPending}>
                                                        <FontAwesomeIcon icon={faTimes} /> Pendente
                                                    </button>
                                                    <button onClick={() => handleAction(event._id, 'cancel')} className={styles.buttonCancel}>
                                                        <FontAwesomeIcon icon={faTimes} /> Cancelar
                                                    </button>
                                                    <button onClick={() => navigate(`/events/${event._id}`)} className={styles.buttonInfo}>
                                                        <FontAwesomeIcon icon={faInfo} /> Detalhes
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Nenhum evento pendente encontrado!</p>
                            )}
                        </>
                    )}

                    {/* Seção de User*/}
                    {activeSection === 'users' && (
                        <>
                            {isLoading ? (
                                <div className='spinner'></div>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : adminEvents.length !== 0 ? (
                                <table className={styles.userTable}>
                                    <thead>
                                        <tr>
                                            <th>Nome de Usuário</th>
                                            <th>Email</th>
                                            <th>Data de Nascimento</th>
                                            
                                        </tr>
                                    </thead>
                                   
                                    <tbody>
                                        {adminEvents.map(user => (
                                            <tr key={user._id}>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{new Date(user.birthDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Nenhum user encontrado!</p>
                            )}
                        </>
                    )}
                    

                </div>
            </div>
        </>
    );
}

export default AdminPage;
