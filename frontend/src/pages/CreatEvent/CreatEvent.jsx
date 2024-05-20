import React, { useState } from 'react';
import Header from "../../components/Header/Header.jsx";
import styles from "./CreatEvent.module.css";
import { useCreatEvent } from "../../hooks/useCreatEvent.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes,faPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from "../../components/Footer/Footer.jsx";

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

    const handleImageChange = async (files) => {
        const imagePromises = [];
        const images = [...eventData.eventImage];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imagePromise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => {
                    const base64 = fileReader.result;
                    images.push(base64);
                    resolve(base64);
                };
                fileReader.onerror = (error) => {
                    console.error('Error converting image to base64:', error);
                    reject(error);
                };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createEvent(
                eventData.eventType,
                eventData.eventName,
                eventData.eventBegDate,
                eventData.eventEndDate,
                eventData.eventDescription,
                eventData.eventAge,
                eventData.eventPrice,
                eventData.eventImage,
                eventData.eventAddress
            );
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };


    return (
        <>
            <Header />
            <div className="body">
                <div className={"defaultContainer " + styles.container}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : (
                        <>
                            <h2>Crie o seu evento ...</h2>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <select value={eventData.eventType} onChange={handleInputChange} name="eventType" className={styles.select + ' defaultselect'} >
                                    <option value="">Escolha uma categoria</option>
                                    <option value="Cultura">Cultura</option>
                                    <option value="Desporto">Desporto</option>
                                    <option value="Educacao">Educação</option>
                                    <option value="Fotografia">Fotografia</option>
                                    <option value="Lazer">Lazer</option>
                                    <option value="Turismo">Turismo</option>
                                </select>
                                <input type="text" placeholder="Nome" name="eventName" value={eventData.eventName} onChange={handleInputChange} className={'defaultInput' }/>
                                <p>Data/Hora:</p>
                                <div className={styles.inputWrapper}>
                                    <p className={styles.p}>Inicial: </p>
                                    <input type="datetime-local" placeholder="Data inicial" name="eventBegDate" value={eventData.eventBegDate} onChange={handleInputChange} className={'defaultInput'}/>
                                    <p className={styles.p}>Final: </p>
                                    <input type="datetime-local" placeholder="Data final" name="eventEndDate" value={eventData.eventEndDate} onChange={handleInputChange} className='defaultInput'/>
                                </div>
                                <textarea placeholder="Descrição" name="eventDescription" value={eventData.eventDescription} onChange={handleInputChange} className='defaultInput'/>
                                
                                <div className={styles.inputWrapper}>
                                    <input type="number" placeholder="Idade recomendada" name="eventAge" value={eventData.eventAge} onChange={handleInputChange} className='defaultInput' min="0"/>
                                    <input type="number" placeholder="Preço" name="eventPrice" value={eventData.eventPrice} onChange={handleInputChange} className='defaultInput' min="0"/>
                                </div>

                                <input type="text" placeholder="Endereço" name="eventAddress" value={eventData.eventAddress} onChange={handleInputChange} className='defaultInput'/>
                                <div>
                                    <input type="file" className="input-field" onChange={(e) => handleImageChange(e.target.files)} style={{ display: 'none' }} id="file" multiple/>
                                    <label htmlFor="file" className={"defaultButton " + styles.fileInput}>
                                        <FontAwesomeIcon icon={faPlus}/>
                                        <span>Adicionar fotos</span>
                                    </label>
                                    {eventData.eventImage.length !== 0 && (
                                        <>
                                            <h3>Fotos do Evento</h3>
                                            
                                            {eventData.eventImage.map((image, index) => (
                                                <div key={index} className={styles.imageWrapper}>
                                                    <img src={image} alt={`Imagem ${index}`} className={styles.image} />
                                                    <FontAwesomeIcon icon={faTimes} onClick={() => removeImage(index)} className={styles.removeButton}/>
                                                </div>
                                            ))}
                                            
                                        </>
                                    )}
                                </div>

                                <button type="submit"  className={"defaultButton " + styles.buttonSubmite} disabled={isLoading}>Submeter</button>
                            </form>
                            {error && <p className="error">{error}</p>}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CreateEvent;
