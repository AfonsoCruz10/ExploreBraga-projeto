import React, { useState, useEffect } from 'react';
import Header from "../../components/Header/Header.jsx";
import styles from "./EditLocation.module.css";
import { useEditLocation } from "../../hooks/useEditLocation.jsx";
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

function EditLocation() {
    const { localId } = useParams();
    const { getLocationDetails, editLocation, isLoading, error, locationDetails } = useEditLocation(localId);
    const [locationData, setLocationData] = useState({
        locationType: '',
        locationName: '',
        locationDescription: '',
        locationAge: '',
        locationAddress: '',
        locationImage: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchLocationDetails = async () => {
            try {
                await getLocationDetails();
            } catch (error) {
                console.error('Error fetching location details:', error);
            }
        };
        fetchLocationDetails();
    }, []);

    useEffect(() => {
        if (locationDetails) {
            setLocationData({
                locationType: locationDetails.Type,
                locationName: locationDetails.Name,
                locationDescription: locationDetails.Description,
                locationAge: locationDetails.AgeRecomendation,
                locationAddress: locationDetails.Address,
                locationImage: locationDetails.Image
            });
        }
    }, [locationDetails]);

    useEffect(() => {
        if (error) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [isSubmitted]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocationData({
            ...locationData,
            [name]: value
        });
    };

    const handleImageChange = async (files) => {
        const imagePromises = [];
        const images = [...locationData.locationImage];

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
            setLocationData({
                ...locationData,
                locationImage: images
            });
        } catch (error) {
            console.error('Error converting images to base64:', error);
        }
    };

    const removeImage = (index) => {
        const updatedImages = [...locationData.locationImage];
        updatedImages.splice(index, 1);
        setLocationData({
            ...locationData,
            locationImage: updatedImages
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editLocation(
                locationData.locationType,
                locationData.locationName,
                locationData.locationDescription,
                locationData.locationAge,
                locationData.locationAddress,
                locationData.locationImage
            );
            setIsSubmitted(!isSubmitted);
        } catch (error) {
            console.error('Error editing location:', error);
        }
    };

    const handleNextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % locationData.locationImage.length);
    };

    const handlePreviousImage = () => {
        setImageIndex((prevIndex) => (prevIndex - 1 + locationData.locationImage.length) % locationData.locationImage.length);
    };

    return (
        <>
            <Header />
            <div className="body">
                <div className={"defaultContainer " + (isEditing ? styles.containerForm : styles.containerLocationDetails)}>
                    {!isEditing ? (
                        <>
                            <h2 className={styles.title}>{locationData.locationName}</h2>
    
                            {locationData.locationImage.length !== 0 && (
                                <div className={styles.imageContainer}>
                                    {locationData.locationImage.length > 1 && (
                                        <FontAwesomeIcon icon={faArrowLeft} className={`${styles.arrowIcon} ${styles.left}`} onClick={handlePreviousImage} />
                                    )}
                                    <img src={locationData.locationImage[imageIndex]} alt="Location image" className={styles.locationImage} />
                                    {locationData.locationImage.length > 1 && (
                                        <FontAwesomeIcon icon={faArrowRight} className={`${styles.arrowIcon} ${styles.right}`} onClick={handleNextImage} />
                                    )}
                                </div>
                            )}

                            <div className={styles.locationSpace}>
                                <div className={styles.locationDetailsLeft}>
                                    <p className={styles.category}>Tipo: {locationData.locationType}</p>
                                    <p className={styles.description}>{locationData.locationDescription}</p>
                                    <p className={styles.address}>Morada: {locationData.locationAddress}</p>
                                </div>
                                <div className={styles.locationDetailsRight}>
                                    <p className={styles.age}>Idade recomendada: {locationData.locationAge}</p>
                                </div>
                            </div>
                            <button onClick={handleEditToggle} className={styles.editButton}>
                                <FontAwesomeIcon icon={faEdit} /> Editar local
                            </button>
                        </>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <FontAwesomeIcon icon={faArrowLeft} onClick={handleEditToggle} className={styles.backIcon} />
    
                            <h2>Editar local</h2>
                            <br />
                            <select value={locationData.locationType} onChange={handleInputChange} name="locationType" className={styles.select + ' defaultselect'}>
                                <option value="">Escolha uma categoria</option>
                                <option value="Comida">Comida</option>
                                <option value="Educação">Educação</option>
                                <option value="Compras">Compras</option>
                                <option value="Beleza">Beleza</option>
                                <option value="Entretenimento">Entretenimento</option>
                                <option value="Religião">Religião</option>
                                <option value="MonumentosHistóricos">Monumentos históricos</option>
                                <option value="Artes">Artes</option>
                            </select>
    
                            <input type="text" placeholder="Nome" name="locationName" value={locationData.locationName} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield} />
                            <textarea placeholder="Descrição" name="locationDescription" value={locationData.locationDescription} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield} />
                            <input type="number" placeholder="Idade recomendada" name="locationAge" value={locationData.locationAge} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield} min="0" />
                            <input type="text" placeholder="Endereço" name="locationAddress" value={locationData.locationAddress} onChange={handleInputChange} className={'defaultInput ' + styles.inputfield} />
    
                            <div>
                                <input type="file" className="input-field" onChange={(e) => handleImageChange(e.target.files)} style={{ display: 'none' }} id="file" multiple />
                                <label htmlFor="file" className={"defaultButton " + styles.fileInput}>
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span>Adicionar fotos</span>
                                </label>
                                {locationData.locationImage.length !== 0 && (
                                    <>
                                        <h3>Fotos do Local</h3>
    
                                        {locationData.locationImage.map((image, index) => (
                                            <div key={index} className={styles.imageWrapper}>
                                                <img src={image} alt={`Imagem ${index}`} className={styles.image} />
                                                <FontAwesomeIcon icon={faTimes} onClick={() => removeImage(index)} className={styles.removeButton} />
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
    
                            <button type="submit" className={"defaultButton " + styles.buttonSubmit} disabled={isLoading}>Submeter</button>
                            {error && <p className="error">{error}</p>}
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default EditLocation;

