import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import styles from './EventDetails.module.css';
import { FaArrowLeft, FaArrowRight, FaHeart, FaShare, FaUser} from 'react-icons/fa';
import { useEventDetails } from '../../hooks/useEventDetails.jsx';
import MyMap from '../../components/MyMap.jsx';
import Footer from "../../components/Footer/Footer.jsx";
import { useSnackbar } from 'notistack';

function EventDetails() {
    const [imageIndex, setImageIndex] = useState(0);
    const { buscarEventDetails, interested, event, counter, check, isLoading, errorBuscar, errorInterested } = useEventDetails();
    const { eventId } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await buscarEventDetails(eventId);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchData();
    }, [eventId]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Confira este evento!',
                url: window.location.href
            })
            .then(() => {
                enqueueSnackbar('Evento compartilhado com sucesso!', { variant: 'success' });
            })
            .catch(() => {
                enqueueSnackbar('Erro ao compartilhar evento.', { variant: 'error' });
            });
        } else {
            enqueueSnackbar('Compartilhamento não suportado neste navegador.', { variant: 'info' });
        }
    };

    const handleInt = async () => {
        await interested(eventId);
    };

    const handleNextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % event.Image.length);
    };

    const handlePreviousImage = () => {
        setImageIndex((prevIndex) => (prevIndex - 1 + event.Image.length) % event.Image.length);
    };

    const showDataTime = (dateTimeString) => {
        const eventEndDate = new Date(dateTimeString);
        const dataFormatada = eventEndDate.toLocaleDateString('pt-PT');
        const horaFormatada = eventEndDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        return `${dataFormatada}, ${horaFormatada}`;
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={"defaultContainer " + styles.eventDetailsContainer}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : (
                        <>
                            {errorBuscar ? (
                                <p className="error">{errorBuscar}</p>
                            ) : event ? (
                                <>
                                    <div className={styles.eventHeader}>
                                        <h2 className={styles.title}>{event.Name}</h2>
                                        <div className={styles.container}>
                                            <FaShare onClick={handleShare} className={styles.shareIcon} />

                                            {errorInterested ? (
                                                <p className="error">{errorInterested}</p>
                                            ) : (    
                                                <>
                                                    <span className={styles.counter}>{counter}</span>
                                                    {check ? (
                                                        <FaHeart onClick={handleInt} className={styles.redHeart} />
                                                    ) : (
                                                        <FaHeart onClick={handleInt} className={styles.borderHeart} />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                    </div>
                                    {(event.Image.length !== 0)&&
                                        <div className={styles.imageContainer}>
                                            {event.Image.length > 1 && (
                                                <FaArrowLeft className={`${styles.arrowIcon} ${styles.left}`} onClick={handlePreviousImage} />
                                            )}
                                            <img src={event.Image[imageIndex]} alt="Event image not found!" className={styles.eventImage} />
                                            {event.Image.length > 1 && (
                                                <FaArrowRight className={`${styles.arrowIcon} ${styles.right}`} onClick={handleNextImage} />
                                            )}
                                        </div>
                                    }
                                    <div className={styles.eventSpace}>
                                        <div className={styles.eventDetailsLeft}>
                                            <p className={styles.category}>Categoria: {event.Type}</p>
                                            <p className={styles.description}>{event.Description}</p>
                                            <p className={styles.address}>Morada: {event.Address}</p>
                                        </div>
                                        <div className={styles.eventDetailsRight}>
                                            <p className={styles.price}>Preço: { (event.Price === 0) ? 'Grátis' : event.Price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                                            <p className={styles.date}>Data inicio: {showDataTime(event.BegDate)}</p>
                                            <p className={styles.date}>Data final: {showDataTime(event.EndDate)}</p>
                                            <p className={styles.address}>Idade recomendada: {event.AgeRecomendation} </p>
                                            
                                            <div className={styles.avatarWrapper}>
                                    
                                                <label className={styles.avatarLabel}>  
                                                    {event.ProfileImage ?
                                                        <img src={event.ProfileImage} alt="Avatar do usuário"/>
                                                        : <FaUser className={styles.defaultAvatar} />
                                                    }
                                                </label>

                                                <p className={styles.creator}>{event.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                
                                    {event.Address && <MyMap address={event.Address} />}

                                </>
                            ) : (
                                <p> Nenhum evento encontrado! </p>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EventDetails;
