import React, { useEffect } from 'react';
import Header from "../../components/Header/Header.jsx";
import { Link } from 'react-router-dom';
import { useUserEvents } from '../../hooks/useEventsUser.jsx';
import { FaArrowLeft} from 'react-icons/fa';
import styles from "./EventsUser.module.css";

function UserEvents() {
    const { userEventsConnect, userEvents, isLoading, error } = useUserEvents();

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

    return (
        <>
            <Header />
            <div className="body">
                <Link to="/userAccount" >
                    <FaArrowLeft  />
                </Link>
                <h2 className="titulo" >Meus Eventos</h2>
                <div className={styles.main}>
                    <div className={styles.userEventsContainer}>
                        {isLoading ? (
                            <div className='spinner'></div>
                        ) : error ? (
                            {error}
                        ) : (
                            <div className={styles.eventList}>
                                {userEvents.map(event => (
                                    <div key={event._id} className={styles.eventItem}>
                                        <p><strong>Nome do Evento:</strong> {event.Name}</p>
                                        <p><strong>Tipo:</strong> {event.Type}</p>
                                        <p><strong>Data de Início:</strong> {new Date(event.BegDate).toLocaleDateString()}</p>
                                        <p><strong>Data de Fim:</strong> {new Date(event.EndDate).toLocaleDateString()}</p>
                                        <p><strong>Endereço:</strong> {event.Address}</p>
                                        <p><strong>Preço:</strong> {event.Price}</p>
                                        <p><strong>Estado:</strong> {event.Status}</p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserEvents;
