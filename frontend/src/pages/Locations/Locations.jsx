import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import { SlArrowDown } from 'react-icons/sl';
import { useSelectLocation } from '../../hooks/useSelectLocation.jsx';
import LocaisCard from "../../components/LocaisCard/LocaisCard.jsx";
import styles from "./Locations.module.css"
import Footer from "../../components/Footer/Footer.jsx";
import { useAuthContext } from "../../hooks/useAuthContext.jsx"


function Locations() {
    const [searchLocalName, setSearchLocalName] = useState("");
    const [searchCat, setSearchCat] = useState("");
    const [locaisToShow, setLocaisToShow] = useState(5);
    const { selectLocationsConnect, getFavoriteLocations, favoriteLocations, errorFav, locations, isLoading, error } = useSelectLocation();
    const { user } = useAuthContext();
    
    useEffect(() => {
        const showLocations = async () => {
            try {
                await selectLocationsConnect();
            } catch (error) {
                console.error('Error show locais', error);
            }
        };
        showLocations();
    }, []);

    useEffect(() => {
        const showLocationsFav = async () => {
            try {
                await getFavoriteLocations();
            } catch (error) {
                console.error('Error show locais', error);
            }
        };
        if(user){
            showLocationsFav();
        }
    }, [user]);


    const handleChangeCat = (event) => {
        setSearchCat(event.target.value);
    };

    const handleInputChange = (e) => {
        setSearchLocalName(e.target.value);
    };

    const handleLoadMore = () => {
        setLocaisToShow(locaisToShow + 5);
    };

    const filteredLocations = locations.filter((local) => {
        const localNameMatch = searchLocalName === "" || local.Name.toLowerCase().includes(searchLocalName.toLowerCase());
        const categoriaMatch = searchCat === "" || (searchCat === "Favoritos" ? favoriteLocations.some(fav => fav._id === local._id) : local.Type === searchCat);
        return localNameMatch && categoriaMatch;

    }).slice(0, locaisToShow);

    return (
        <>
            <Header />
            <div className="body">
                <h1 className="titulo">Locais</h1>
                <div>

                    <div className={styles["search-container"]}>

                        <input type="text" placeholder="Pesquisar por local" name="localName" value={searchLocalName} onChange={handleInputChange} className={'defaultInput ' + styles.inputField} />

                        {!user ? 
                            <select value={searchCat} onChange={handleChangeCat} className={styles.select + ' defaultselect'}>
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
                            : errorFav ? (
                                <p className="error">{errorFav}</p>
                            ) :
                            <select value={searchCat} onChange={handleChangeCat} className={styles.select + ' defaultselect'}>
                                <option value="">Escolha uma categoria</option>
                                <option value="Comida">Comida</option>
                                <option value="Educação">Educação</option>
                                <option value="Compras">Compras</option>
                                <option value="Beleza">Beleza</option>
                                <option value="Entretenimento">Entretenimento</option>
                                <option value="Religião">Religião</option>
                                <option value="MonumentosHistóricos">Monumentos históricos</option>
                                <option value="Artes">Artes</option>
                                <option value="Favoritos">Locais Favoritos</option>
                            </select>
                        }
                        

                    </div>

                    <div className={styles.cartoes}>
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <div>
                                {filteredLocations.length ? (
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
                                            {filteredLocations.length >= locaisToShow && locations.length > locaisToShow && (
                                                <div className={styles.Arrow} onClick={handleLoadMore}>
                                                    <SlArrowDown />
                                                </div>
                                            )}
                                        </div>
                                    </>

                                ) : (
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


export default Locations;
