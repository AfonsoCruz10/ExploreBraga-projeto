import React, { useState } from 'react';
import Header from "../../components/Header/Header.jsx";
import styles from "./CreateLocation.module.css";
import { useCreateLocation } from "../../hooks/useCreateLocation.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from "../../components/Footer/Footer.jsx";

function CreateLocation() {
    const { createLocation, isLoading, error } = useCreateLocation();
    const [localData, setLocalData] = useState({
        localType: '',
        localName: '',
        localDescription: '',
        localAge: '',
        localImage: [],
        localAddress: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalData({
            ...localData,
            [name]: value
        });
    };

    const handleImageChange = async (files) => {
        const imagePromises = [];
        const images = [...localData.localImage];

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
            setLocalData({
                ...localData,
                localImage: images
            });
        } catch (error) {
            console.error('Error converting images to base64:', error);
        }
    };

    const removeImage = (index) => {
        const updatedImages = [...localData.localImage];
        updatedImages.splice(index, 1);
        setLocalData({
            ...localData,
            localImage: updatedImages
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLocation(
                localData.localType,
                localData.localName,
                localData.localDescription,
                localData.localAge,
                localData.localImage,
                localData.localAddress
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
                            <h2>Crie o seu local ...</h2>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <select value={localData.localType} onChange={handleInputChange} name="localType" className={styles.select + ' defaultselect'} >
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
                                <input type="text" placeholder="Nome" name="localName" value={localData.localName} onChange={handleInputChange} className={'defaultInput'} />

                                <textarea placeholder="Descrição" name="localDescription" value={localData.localDescription} onChange={handleInputChange} className='defaultInput' />

                                <div className={styles.inputWrapper}>
                                    <input type="number" placeholder="Idade recomendada" name="localAge" value={localData.localAge} onChange={handleInputChange} className='defaultInput' min="0" />
                                </div>

                                <input type="text" placeholder="Endereço" name="localAddress" value={localData.localAddress} onChange={handleInputChange} className='defaultInput' />
                                <div>
                                    <input type="file" className="input-field" onChange={(e) => handleImageChange(e.target.files)} style={{ display: 'none' }} id="file" multiple />
                                    <label htmlFor="file" className={"defaultButton " + styles.fileInput}>
                                        <FontAwesomeIcon icon={faPlus} />
                                        <span>Adicionar fotos</span>
                                    </label>
                                    {localData.localImage.length !== 0 && (
                                        <>
                                            <h3>Fotos do Local</h3>

                                            {localData.localImage.map((image, index) => (
                                                <div key={index} className={styles.imageWrapper}>
                                                    <img src={image} alt={`Imagem ${index}`} className={styles.image} />
                                                    <FontAwesomeIcon icon={faTimes} onClick={() => removeImage(index)} className={styles.removeButton} />
                                                </div>
                                            ))}

                                        </>
                                    )}
                                </div>

                                <button type="submit" className={"defaultButton " + styles.buttonSubmite} disabled={isLoading}>Submeter</button>
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

export default CreateLocation;
