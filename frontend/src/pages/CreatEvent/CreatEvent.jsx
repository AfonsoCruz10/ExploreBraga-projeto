import React, { useState } from 'react';
import Header from "../../components/Header/Header.jsx";
import styles from "./CreatEvent.module.css";
import { useCreatEvent } from "../../hooks/useCreatEvent.jsx";

function CreateEvent() {
    const { createEvent, isLoading, error } = useCreatEvent();
    const [eventData, setEventData] = useState({
        eventType: '',
        eventName: '',
        eventBegDate: '',
        eventEndDate: '',
        eventDescription: '',
        eventAge: '',
        eventPrice: '',
        eventImage: [], 
        eventAddress: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({
            ...eventData,
            [name]: value
        });
    };

    const handleImageChange = async (e) => {
        const files = e.target.files;
        const imagePromises = [];
        const images = [];
        
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
            const resolvedImages = await Promise.all(imagePromises);
            console.log("Resolved images:", resolvedImages);
            console.log("Images:", images);
    
            setEventData({
                ...eventData,
                eventImage: images
            });
        } catch (error) {
            console.error('Error converting images to base64:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("EventData image:", eventData.eventImage);
            await createEvent(eventData.eventType, eventData.eventName, eventData.eventBegDate, eventData.eventEndDate, eventData.eventDescription, eventData.eventAge, eventData.eventPrice, eventData.eventImage, eventData.eventAddress);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={styles.container}>
                    {isLoading ? (
                            <div className='spinner'></div>
                        ) : (
                            <>

                            <h2>Create Event</h2>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <select value={eventData.eventType} onChange={handleInputChange} name="eventType" className={styles.select} required>
                                    <option value="">Escolha uma categoria</option>
                                    <option value="Cultura">Cultura</option>
                                    <option value="Desporto">Desporto</option>
                                    <option value="Educacao">Educação</option>
                                    <option value="Fotografia">Fotografia</option>
                                    <option value="Lazer">Lazer</option>
                                    <option value="Turismo">Turismo</option>
                                </select>

                                <input type="text" placeholder="Event Name" name="eventName" value={eventData.eventName} onChange={handleInputChange} required />
                                <input type="datetime-local" placeholder="Event Begin Date" name="eventBegDate" value={eventData.eventBegDate} onChange={handleInputChange} required />
                                <input type="datetime-local" placeholder="Event End Date" name="eventEndDate" value={eventData.eventEndDate} onChange={handleInputChange} required />
                                <textarea placeholder="Event Description" name="eventDescription" value={eventData.eventDescription} onChange={handleInputChange} required />
                                <input type="text" placeholder="Event Age Recommendation" name="eventAge" value={eventData.eventAge} onChange={handleInputChange} required />
                                <input type="text" placeholder="Event Price" name="eventPrice" value={eventData.eventPrice} onChange={handleInputChange} required />
                                <input type="text" placeholder="Event Address" name="eventAddress" value={eventData.eventAddress} onChange={handleInputChange} required />

                                <div className="file-input-container">
                                    <label htmlFor="file" className="file-input-label">
                                        Upload Image(s)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={styles.fileInput}
                                        multiple  
                                        required
                                    />
                                </div>
                                
                                <button type="submit">Create Event</button>
                            </form>
                            {error && <p className={styles.error}>{error}</p>}

                            </>
                        )}
                </div>
            </div>
        </>
    );
}

export default CreateEvent;

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
