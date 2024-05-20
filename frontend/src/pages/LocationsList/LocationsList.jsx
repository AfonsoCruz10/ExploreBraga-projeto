import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import { SlArrowDown } from 'react-icons/sl';
import { useSelectLocation } from '../../hooks/useSelectLocation.jsx';
import LocaisCard from "../../components/LocaisCard/LocaisCard.jsx";
import styles from "./LocationsList.module.css"
import { Categories_List } from "../../CategoriesMenuGrid/CategoriesGrid.jsx";
import Footer from "../../components/Footer/Footer.jsx";


function LocationsList({ userLocationChoice, setUserLocationChoice }) {
    const [searchCat, setSearchCat] = useState(userLocationChoice);
    const [locaisToShow, setLocaisToShow] = useState(5);
    const [searchLocalName, setSearchLocalName] = useState("");
    const { selectLocationsConnect, locations, isLoading, error } = useSelectLocation();
    
    console.log("Valor inicial de searchCat:", searchCat);
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

    const handleInputChange = (e) => {
        setSearchLocalName(e.target.value);
    };

    const handleLoadMore = () => {
        setLocaisToShow(locaisToShow + 5);
    };

    const filteredLocations = locations.filter((local) => {
        const localNameMatch = searchLocalName === "" || local.Name.toLowerCase().includes(searchLocalName.toLowerCase());
        const categoriaMatch = searchCat === "All Places" || local.Type === searchCat;
        return localNameMatch && categoriaMatch;
    }).slice(0, locaisToShow);

    return (
        <>
            <Header />
            <div className="body">
                <h1 className="titulo">Locais</h1>
                <div>

                    <div className={styles["search-container"]}>

                        <input type="text" placeholder="Pesquisar por local" name="localName" value={searchLocalName} onChange={handleInputChange} className={'defaultInput ' + styles.inputField}/>

                        <select value={searchCat} onChange={handleChangeCat} className={styles.select + ' defaultselect'}>
                            {Categories_List.map((category, index) => (
                                <option key={index} value={category.title}>{category.title}</option>
                            ))}
                        </select>

                    </div>

                    <div className={styles.cartoes}>
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <div>
                                {filteredLocations.length  ? (
                                    <>                                    
                                    {filteredLocations.map((local, index) => (
                                        <LocaisCard
                                            key={index}
                                            id={local._id}
                                            Image={local.Image}
                                            Type={local.Type}
                                            Name={local.Name}
                                            Adress={local.Address}
                                            Creator={local.username}
                                        />
                                    ))}
                                    <div>
                                        {filteredLocations.length > locaisToShow && (
                                            <div className={styles.Arrow} onClick={handleLoadMore}>
                                                <SlArrowDown /> 
                                            </div>
                                        )}
                                    </div>
                                    </>

                                ) :(
                                    <p>Nenhum local encontrado!</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}


export default LocationsList;
