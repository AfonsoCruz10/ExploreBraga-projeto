import React, { useState, useEffect } from 'react';
import Header from "../../components/Header/Header.jsx";
import styles from "./EditEvent.module.css";
import { useEditEvent } from "../../hooks/useEditEvent.jsx";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowRight, faArrowLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from "../../components/Footer/Footer.jsx";

// Função para converter o arquivo de imagem em base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}

function EditEvent() {
    const { eventId } = useParams();
    const { getEventDetails, editEvent, buscarLocais, locais, isLoading, error, errorLocais, eventDetails } = useEditEvent(eventId);
    const [eventData, setEventData] = useState({
        eventType: '',
        eventName: '',
        eventBegDate: '',
        eventEndDate: '',
        eventDescription: '',
        eventAge: '',
        eventPrice: '',
        eventAddress: '',
        eventImage: [],
        eventLocAssoc: null
    });
    const [imageIndex, setImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isSbumited, setIsSbumited] = useState(false);

    useEffect(() => {
        const showEvents = async () => {
            try {
                await getEventDetails();
                await buscarLocais();
            } catch (error) {
                console.error('Error show events', error);
            }
        };
        showEvents();
    }, []);

    useEffect(() => {
        if (error) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [isSbumited]);

    useEffect(() => {
        if (eventDetails) {
            setEventData({
                eventType: eventDetails.Type,
                eventName: eventDetails.Name,
                eventBegDate: eventDetails.BegDate,
                eventEndDate: eventDetails.EndDate,
                eventDescription: eventDetails.Description,
                eventAge: eventDetails.AgeRecomendation,
                eventPrice: eventDetails.Price,
                eventAddress: eventDetails.Address,
                eventImage: eventDetails.Image,
                eventLocAssoc: eventDetails.LocAssoc
            });
        }
        console.log(eventData)
    }, [eventDetails]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    const handleImageChange = async (files) => {
        const imagePromises = [];
        const images = [...eventData.eventImage];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imagePromise = new Promise((resolve, reject) => {
                convertToBase64(file)
                    .then(base64 => {
                        images.push(base64);
                        resolve(base64);
                    })
                    .catch(error => {
                        console.error('Error converting image to base64:', error);
                        reject(error);
                    });
            });
            imagePromises.push(imagePromise);
        }

        try {
            await Promise.all(imagePromises);
            setEventData({
                ...eventData,
                eventImage: images
            });
        } catch (error) {
            console.error('Error converting images to base64:', error);
        }
    };

    const removeImage = (index) => {
        const updatedImages = [...eventData.eventImage];
        updatedImages.splice(index, 1);
        setEventData({
            ...eventData,
            eventImage: updatedImages
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleNextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % eventData.eventImage.length);
    };

    const handlePreviousImage = () => {
        setImageIndex((prevIndex) => (prevIndex - 1 + eventData.eventImage.length) % eventData.eventImage.length);
    };


    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        const hours = `${date.getHours()}`.padStart(2, '0');
        const minutes = `${date.getMinutes()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const showDataTime = (dateTimeString) => {
        const eventEndDate = new Date(dateTimeString);
        const dataFormatada = eventEndDate.toLocaleDateString('pt-PT');
        const horaFormatada = eventEndDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false });

        return `${dataFormatada}, ${horaFormatada}`;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editEvent(eventData.eventType, eventData.eventName, eventData.eventBegDate, eventData.eventEndDate, eventData.eventDescription, eventData.eventAge, eventData.eventPrice, eventData.eventImage, eventData.eventAddress, eventData.eventLocAssoc);
            setIsSbumited(!isSbumited);
        } catch (error) {
            console.error('Error editing event:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={"defaultContainer " + `${isEditing ? styles.containerForm: styles.containerEventsDetails}`}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : (
                        <>
                            {!isEditing ? (
                                <>
                                    <h2 className={styles.title}>{eventData.eventName}</h2>

                                    {(eventData.eventImage.length !== 0) &&
                                        <div className={styles.imageContainer}>
                                            {eventData.eventImage.length > 1 && (
                                                <FontAwesomeIcon icon={faArrowLeft} className={`${styles.arrowIcon} ${styles.left}`} onClick={handlePreviousImage} />
                                            )}
                                            <img src={eventData.eventImage[imageIndex]} alt="Event image not found!" className={styles.eventImage} />
                                            {eventData.eventImage.length > 1 && (
                                                <FontAwesomeIcon icon={faArrowRight} className={`${styles.arrowIcon} ${styles.right}`} onClick={handleNextImage} />
                                            )}
                                        </div>
                                    }
                                    <div className={styles.eventSpace}>
                                        <div className={styles.eventDetailsLeft}>
                                            <p className={styles.category}>Categoria: {eventData.eventType}</p>
                                            <p className={styles.description}>{eventData.eventDescription}</p>
                                            <p className={styles.address}>Morada: {eventData.eventAddress}</p>
                                        </div>
                                        <div className={styles.eventDetailsRight}>
                                            <p className={styles.price}>Preço: {(eventData.eventPrice === 0) ? 'Grátis' : eventData.eventPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                                            <p className={styles.date}>Data Inicio: {showDataTime(eventData.eventBegDate)}</p>
                                            <p className={styles.date}>Data final: {showDataTime(eventData.eventEndDate)}</p>
                                            <p className={styles.address}>Idade recomendada: {eventData.eventAge} </p>
                                        </div>
                                    </div>
                                    <button onClick={handleEditToggle} className={styles.editButton}>
                                        <FontAwesomeIcon icon={faEdit} /> Editar evento
                                    </button>
                                </>
                            ) : (

                                <form className={styles.form} onSubmit={handleSubmit}>
                                    <FontAwesomeIcon icon={faArrowLeft} onClick={handleEditToggle} className={styles.backIcon} />

                                    <h2>Editar evento</h2>
                                    <br />
                                    <select value={eventData.eventType} onChange={handleInputChange} name="eventType" className={styles.select + ' defaultselect'} >
                                        <option value="">Escolha uma categoria</option>
                                        <option value="Cultura">Cultura</option>
                                        <option value="Desporto">Desporto</option>
                                        <option value="Educacao">Educação</option>
                                        <option value="Fotografia">Fotografia</option>
                                        <option value="Lazer">Lazer</option>
                                        <option value="Turismo">Turismo</option>
                                    </select>

                                    {errorLocais ?
                                        <p className={styles.error}>{errorLocais}</p>
                                        :
                                        (locais.length > 0 &&
                                        <select value={eventData.eventLocAssoc} onChange={handleInputChange} name="eventLocAssoc" className={styles.select + ' defaultselect'}>
                                            <option value="">Associe este evento a um local</option>
                                            {locais.map(location => (
                                                <option key={location._id} value={location._id}>{location.Name}</option>
                                            ))}
                                        </select>
                                    )}


                                    <input type="text" placeholder="Nome" name="eventName" value={eventData.eventName} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield}/>
                                    <p>Data/Hora: </p>
                                    <div className={styles.inputWrapper}>
                                        <p className={styles.p}>Inicial: </p>
                                        <input type="datetime-local" placeholder="Data inicial" name="eventBegDate" value={formatDateTime(eventData.eventBegDate)} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield}/>
                                        <p className={styles.p}>Final: </p>
                                        <input type="datetime-local" placeholder="Data final" name="eventEndDate" value={formatDateTime(eventData.eventEndDate)} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield}/>
                                    </div>
                                    <textarea placeholder="Descrição" name="eventDescription" value={eventData.eventDescription} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield}/>
                                    <div className={styles.inputWrapper}>
                                        <p className={styles.p}>Idade recomendada: </p>
                                        <input type="number" placeholder="Idade recomendada" name="eventAge" value={eventData.eventAge} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield} min="0"/>
                                        <p className={styles.p}> Preço: </p>
                                        <input type="number" placeholder="Preço" name="eventPrice" value={eventData.eventPrice} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield} min="0"/>
                                    </div>
                                    <input type="text" placeholder="Endereço" name="eventAddress" value={eventData.eventAddress} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield}/>

                                    <div>
                                        <input type="file" className="input-field" onChange={(e) => handleImageChange(e.target.files)} style={{ display: 'none' }} id="file" multiple />
                                        <label htmlFor="file" className={"defaultButton " + styles.fileInput}>
                                            <FontAwesomeIcon icon={faPlus} />
                                            <span>Adicionar fotos</span>
                                        </label>
                                        {eventData.eventImage.length !== 0 && (
                                            <>
                                                <h3>Fotos do Evento</h3>

                                                {eventData.eventImage.map((image, index) => (
                                                    <div key={index} className={styles.imageWrapper}>
                                                        <img src={image} alt={`Imagem ${index}`} className={styles.image} />
                                                        <FontAwesomeIcon icon={faTimes} onClick={() => removeImage(index)} className={styles.removeButton} />
                                                    </div>
                                                ))}

                                            </>
                                        )}
                                    </div>

                                    <button type="submit" className={"defaultButton " + styles.buttonSubmite} disabled={isLoading}>Submeter</button>
                                    {error && <p className="error">{error}</p>}

                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EditEvent;

