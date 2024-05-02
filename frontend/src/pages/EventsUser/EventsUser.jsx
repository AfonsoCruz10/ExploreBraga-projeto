import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header.jsx";
import { useUserEvents } from '../../hooks/useEventsUser.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from "./EventsUser.module.css";
import { useNavigate } from 'react-router-dom';


function UserEvents() {
    const { userEventsConnect, eventDelete, userEvents, isLoading, error, errorDelete } = useUserEvents();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await userEventsConnect();
            } catch (error) {
                console.error('Error fetching user events:', error);
            }
        };
    
        fetchData();
    }, []);

    const handleEdit = (eventId) => {
        
    };

    const handleDelete = async (eventId) => {
        try {
            await eventDelete(eventId);
            await userEventsConnect();
        } catch (error) {
            console.error('Error delete Events:', error);
        }
    };

 
    const sortedEvents = userEvents.slice().sort((a, b) => new Date(a.BegDate) - new Date(b.BegDate));

    return (
        <>
            <Header />
            <div className="body">
                <h2 className="titulo">Meus Eventos</h2>
                <div className={styles.userEventsContainer}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : userEvents.length !== 0 ? (
                        <table className={styles.eventTable}>
                            <thead>
                                <tr>
                                    <th>Nome do Evento</th>
                                    <th>Tipo</th>
                                    <th>Data de Início</th>
                                    <th>Data de Fim</th>
                                    <th>Endereço</th>
                                    <th>Preço</th>
                                    <th>Estado</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEvents.map(event => (
                                    <tr key={event._id}>
                                        <td>{event.Name}</td>
                                        <td>{event.Type}</td>
                                        <td>{new Date(event.BegDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                        <td>{new Date(event.EndDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                        <td>{event.Address}</td>
                                        <td>{event.Price}</td>
                                        <td>{event.Status}</td>
                                        <td>
                                            <button onClick={() => navigate(`/events/edit/${event._id}`)} className={styles.buttonEdit}>
                                                <FontAwesomeIcon icon={faEdit} /> Editar
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className={styles.buttonDelete}>
                                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum evento encontrado!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserEvents;
