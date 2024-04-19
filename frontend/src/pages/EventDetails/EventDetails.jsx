import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import styles from './EventDetails.module.css';
import { FaArrowLeft, FaArrowRight ,FaHeart } from 'react-icons/fa';
import { useEventDetails } from '../../hooks/useEventDetails.jsx';


function EventDetails() {
    const [imageIndex, setImageIndex] = useState(0);
    const {buscarEventDetails, interested, event, counter, check, isLoading, errorBuscar, errorInterested} = useEventDetails();
    const { eventId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await  buscarEventDetails(eventId);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchData();
    }, [eventId]);
    

    const handleInt = async () => {
        await interested(eventId);
    };
    
    const handleNextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % event.Image.length);
    };

    const handlePreviousImage = () => {
        setImageIndex((prevIndex) => (prevIndex - 1 + event.Image.length) % event.Image.length);
    };

    return (
        <>
            <Header />
            <div className="body">
                {errorInterested ? (
                    <p className="error">{errorInterested}</p>
                ) : (
                    <div className={styles.container}>
                        {check ? (
                            <FaHeart onClick={handleInt} className={styles.redHeart} />
                        ) : (
                            <FaHeart onClick={handleInt} className={styles.borderHeart} />
                        )}
                        <span className={styles.counter}>{counter}</span>
                    </div>

                )}

                <div className={styles.eventDetails}>
                    {isLoading ? (
                        <div className='spinner'></div>
                        ) : errorBuscar ? (
                            <p className="error">{errorBuscar}</p>
                        ) : event ? (
                            <>
                            <div className={styles.imageContainer}>
                                {event.Image.length > 1 && (
                                    <FaArrowLeft className={`${styles.arrowIcon} ${styles.left}`} onClick={handlePreviousImage} />
                                )}
                                <img src={event.Image[imageIndex]} alt="Event image not found!" className={styles.eventImage} />
                                {event.Image.length > 1 && (
                                    <FaArrowRight className={`${styles.arrowIcon} ${styles.right}`} onClick={handleNextImage} />
                                )}

                            </div>
                            
                            <h1 className={styles.title}>{event.Name}</h1>
                            <p className={styles.category}>Category: {event.Type}</p>
                            <p className={styles.description}>{event.Description}</p>
                            <p className={styles.date}>Start Date: {new Date(event.BegDate).toLocaleString()}</p>
                            <p className={styles.date}>End Date: {new Date(event.EndDate).toLocaleString()}</p>
                            <p className={styles.address}>Address: {event.Address}</p>
                            <p className={styles.price}>Price: {event.Price}</p>
                            <p className={styles.creator}>Organizer: {event.Creator}</p>
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