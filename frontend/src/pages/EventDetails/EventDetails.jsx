import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header.jsx';
import styles from './EventDetails.module.css';
import { FaArrowLeft, FaThumbsUp } from 'react-icons/fa';

function EventDetails() {
    const [event, setEvent] = useState(null);
    const [likes, setLikes] = useState(0);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/events/${eventId}`);
                setEvent(response.data.event);
                // Atualiza o contador de likes com base na quantidade de usuários interessados
                setLikes(response.data.event.InterestedUsers.length);
            } catch (error) {
                console.error('Error fetching event details:', error.message);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    const handleLike = async () => {
        try {
            // Verifica se o usuário já deu like no evento
            if (event.InterestedUsers.includes(userId)) {
                // Se já deu like, remove o ID do usuário da lista
                await axios.put(`http://localhost:5555/users/${userId}/events/${eventId}/unlike`);
                setLikes(likes - 1); // Decrementa o contador de likes
            } else {
                // Se não deu like, adiciona o ID do usuário à lista
                await axios.put(`http://localhost:5555/users/${userId}/events/${eventId}/like`);
                setLikes(likes + 1); // Incrementa o contador de likes
            }
        } catch (error) {
            console.error('Error liking event:', error.message);
        }
    };
    
    return (
        <>
            <Header />
            <div className="body">
                <Link to="/events" className={styles.backLink}>
                    <FaArrowLeft className={styles.backIcon} />
                    Back to Events
                </Link>
                <div className={styles.likeContainer}>
                    <FaThumbsUp className={styles.likeIcon} onClick={handleLike} />
                    <span className={styles.likeCount}>{likes}</span>
                </div>
                <div className={styles.eventDetails}>
                    {event ? (
                        <>
                            <h1 className={styles.title}>{event.Name}</h1>
                            <p className={styles.category}>Category: {event.Type}</p>
                            <p className={styles.description}>{event.Description}</p>
                            <p className={styles.date}>Start Date: {new Date(event.BegDate).toLocaleString()}</p>
                            <p className={styles.date}>End Date: {new Date(event.EndDate).toLocaleString()}</p>
                            <p className={styles.address}>Address: {event.Address}</p>
                            <p className={styles.price}>Price: {event.Price}</p>
                            <p className={styles.creator}>Organizer: {event.Creator}</p>
                            
                            <img src={event.Image} alt="Event image not found!" className={styles.eventImage} />
                        </>
                    ) : (
                        <p>Loading event details...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default EventDetails;
