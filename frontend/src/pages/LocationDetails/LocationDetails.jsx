import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import styles from './LocationDetails.module.css';
import { FaArrowLeft, FaArrowRight, FaHeart, FaShare, FaStar, FaUser } from 'react-icons/fa';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import MyMap from '../../components/MyMap.jsx';
import Footer from "../../components/Footer/Footer.jsx";
import { useLocalDetails } from '../../hooks/useLocalDetails.jsx';
import Reviews from '../../components/Reviews/Reviews.jsx';
import { useInfoAccount } from '../../hooks/useInfoAccount.jsx';


function LocalDetails() {
    const { useraccountConnect, info } = useInfoAccount();
    console.log("userinfo no locais:", info);
    console.log("username no locais:", info.username);
    console.log("userid no locais:", info._id);
    const [imageIndex, setImageIndex] = useState(0);
    const { buscarLocalDetails, favoritesLocationsList, local, counter, check, isLoading, errorBuscar, errorInterested } = useLocalDetails();
    console.log("localinfo no locais:", local);
    const [averageRating, setAverageRating] = useState(0);
    const { localId } = useParams();

    const stars = Array(5).fill(0);
    const colors = {
        orange: "#F2C265",
        grey: "a9a9a9"
    }

    // ir buscar a info do user
    useEffect(() => {
        const fetchData = async () => {
            try {
                await useraccountConnect();
            } catch (error) {
                console.error('Error fetching useraccount:', error);
            }
        };

        fetchData();
    }, []);

    // ir buscar a info do local
    useEffect(() => {
        const fetchData = async () => {
            try {
                await buscarLocalDetails(localId);
            } catch (error) {
                console.error('Error fetching local details:', error);
            }
        };

        fetchData();
    }, [localId]);

    //calcular a média das reviews do local
    useEffect(() => {
        const fetchReviews = () => {
            try {
                if (local && local.Reviews) {
                    if (local.Reviews.length > 0) {
                        const totalRating = local.Reviews.reduce((accumulator, review) => accumulator + review.classification, 0);
                        const avgRating = totalRating / local.Reviews.length;
                        setAverageRating(avgRating.toFixed(2));
                    }
                    else {
                        setAverageRating(0);
                    }
                }

            } catch (error) {
                console.error("Não foi possível calcular a média da classificação:", error);
            }
        }

        fetchReviews();
    }, [local]);

    // Função para compartilhar o local
    const handleShare = () => {
        // Verifica se o navegador suporta a API de compartilhamento
        if (navigator.share) {
            // Se suportado, chama a API de compartilhamento
            navigator.share({
                title: document.title,
                text: 'Confira este local!',
                url: window.location.href
            })
                .then(() => console.log('Compartilhado com sucesso!'))
                .catch((error) => console.error('Erro ao compartilhar:', error));
        } else {
            // Se não suportado, mostra uma mensagem de fallback
            alert('Compartilhamento não suportado neste navegador.');
        }
    };

    const handleAddToFavoritePlacesList = async () => {
        await favoritesLocationsList(localId, info._id);
    };

    const handleNextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % local.Image.length);
    };

    const handlePreviousImage = () => {
        setImageIndex((prevIndex) => (prevIndex - 1 + local.Image.length) % local.Image.length);
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
                            ) : local ? (
                                <>
                                    <div className={styles.eventHeader}>
                                        <h2 className={styles.title}>{local.Name}</h2>

                                        <div className={styles.reviewMedia}>
                                            {stars.map((star, index) => (
                                                <FaStar
                                                    key={index}
                                                    size={22}
                                                    color={averageRating >= index + 1 ? colors.orange : colors.grey}
                                                />
                                            ))}
                                            <div className={styles.reviewMediaText}>
                                                <h3>({averageRating}, {local.Reviews.length} avaliações)</h3>
                                            </div>
                                        </div>
                                        <div className={styles.container}>
                                            <FaShare onClick={handleShare} className={styles.shareIcon} />

                                            {errorInterested ? (
                                                <p className="error">{errorInterested}</p>
                                            ) : (
                                                <>
                                                    <span className={styles.counter}>{counter}</span>
                                                    {check ? (
                                                        <FaBookmark onClick={handleAddToFavoritePlacesList} className={styles.redHeart} />
                                                    ) : (
                                                        <FaRegBookmark onClick={handleAddToFavoritePlacesList} className={styles.borderHeart} />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                    </div>
                                    {(local.Image.length !== 0) &&
                                        <div className={styles.imageContainer}>
                                            {local.Image.length > 1 && (
                                                <FaArrowLeft className={`${styles.arrowIcon} ${styles.left}`} onClick={handlePreviousImage} />
                                            )}
                                            <img src={local.Image[imageIndex]} alt="Event image not found!" className={styles.eventImage} />
                                            {local.Image.length > 1 && (
                                                <FaArrowRight className={`${styles.arrowIcon} ${styles.right}`} onClick={handleNextImage} />
                                            )}
                                        </div>
                                    }
                                    <div className={styles.eventSpace}>
                                        <div className={styles.eventDetailsLeft}>
                                            <p className={styles.category}>Categoria: {local.Type}</p>
                                            <p className={styles.description}>{local.Description}</p>
                                            <p className={styles.address}>Morada: {local.Address}</p>
                                        </div>
                                        <div className={styles.eventDetailsRight}>
                                            <p className={styles.address}>Idade recomendada: {local.AgeRecomendation} </p>
                                            <div className={styles.creator}>
                                                <div className={styles.imageLabel}>
                                                    {local.CreatorProfilePhoto ?
                                                        <img src={local.CreatorProfilePhoto} alt="Imagem do utilizador" />
                                                        : <FaUser className={styles.defaultAvatar} />
                                                    }
                                                </div>
                                                <div>
                                                    <p className={styles.creator}> {local.username} (Criador)</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <Reviews reviews={local.Reviews} localId={localId} averageRating={averageRating} username={info.username} userId={info._id} />
                                    {local.Address && <MyMap address={local.Address} />}

                                </>
                            ) : (
                                <p> Nenhum local encontrado! </p>
                            )}
                        </>
                    )}
                </div>
            </div >
            <Footer />
        </>
    );
}

export default LocalDetails;
