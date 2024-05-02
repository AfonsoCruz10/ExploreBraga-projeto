import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import { FaArrowDown } from 'react-icons/fa';
import { useSelectLocation } from '../../hooks/useSelectLocation.jsx';
import LocaisCard from "../../components/LocaisCard/LocaisCard.jsx";
import styles from "./LocationsList.module.css"
import Modal from "react-modal";
import { Categories_List } from "../../CategoriesMenuGrid/CategoriesGrid.jsx";


function LocationsList({ userLocationChoice, setUserLocationChoice }) {
    const [searchCat, setSearchCat] = useState(userLocationChoice);
    console.log("Valor inicial de searchCat:", searchCat);
    const [locaisToShow, setLocaisToShow] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const { selectLocationsConnect, locations, isLoading, error } = useSelectLocation();

    console.log("Escolha da categoria no locationlist:", userLocationChoice);

    const handleChangeCat = (event) => {
        setSearchCat(event.target.value);
    };

    useEffect(() => {
        const showLocations = async () => {
            try {
                await selectLocationsConnect();
            } catch (error) {
                console.error('Error show events', error);
            }
        };
        showLocations();
    }, []);


    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleLoadMore = () => {
        setLocaisToShow(locaisToShow + 5);
    };


    useEffect(() => {
        console.log("Locations:", locations);
    }, [locations]);

    const filteredLocations = locations.filter((local) => {
        const categoriaMatch = searchCat === "All Places" || local.Type === searchCat;
        return categoriaMatch;
    }).slice(0, locaisToShow);

    return (
        <>
            <Header />
            <div className="body">
                <h1 className="titulo">Locations</h1>
                <div className={styles.wrapper}>
                    <div>
                        <h1>Locations</h1>
                    </div>

                    <p className={styles["button-text"]} onClick={openModal}> Abrir Filtros </p>

                    <Modal
                        isOpen={modalOpen}
                        onRequestClose={closeModal}
                        overlayClassName={styles["ReactModal__Overlay"]}
                        className={styles["ReactModal__Content"]}
                    >

                        <span className={styles["close-button"]} onClick={closeModal}>&times;</span>

                        <div className={styles["search-container"]}>
                            <select value={searchCat} onChange={handleChangeCat} className={styles.caixaevents}>
                                {Categories_List.map((category, index) => (
                                    <option key={index} value={category.title}>{category.title}</option>
                                ))}
                            </select>

                        </div>
                    </Modal>

                    <div className={styles.cartoes}>
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <div>
                                {filteredLocations.map((local, index) => (
                                    <LocaisCard
                                        key={index}
                                        id={local._id}
                                        Type={local.Type}
                                        Name={local.Name}
                                        Adress={local.Address}
                                        Creator={local.username}
                                    />
                                ))}
                                <div>
                                    {locations.length > locaisToShow && (
                                        <div onClick={handleLoadMore}>
                                            <FaArrowDown />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </>
    );
}


export default LocationsList;
