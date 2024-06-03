import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import styles from './LocationDetails.module.css';
import { FaArrowLeft, FaArrowRight, FaShare, FaStar, FaUser } from 'react-icons/fa';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { MdOutlineDeleteForever } from "react-icons/md";
import MyMap from '../../components/MyMap.jsx';
import Footer from "../../components/Footer/Footer.jsx";
import { useLocalDetails } from '../../hooks/useLocalDetails.jsx';
import { useSnackbar } from 'notistack';
import { useReviewActions } from '../../hooks/useReviewActions';
import Eventscard from "../../components/Eventscard/Eventscard.jsx";

function LocalDetails() {
    const { localId } = useParams();
    const [imageIndex, setImageIndex] = useState(0);
    const { buscarLocalDetails, favoritesLocationsList, buscarEventosAssociados,local, associatedEvents, check, isLoading, isLoadingEvents, errorBuscar, errorInterested, errorEvents } = useLocalDetails();
    const [averageRating, setAverageRating] = useState(0);
    const [verEvents, setVerEvents] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const stars = Array(5).fill(0);
    const colors = {
        orange: "#F2C265",
        grey: "a9a9a9"
    }

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
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Confira este local!',
                url: window.location.href
            })
            .then(() => {
                enqueueSnackbar('Local compartilhado com sucesso!', { variant: 'success' });
            })
            .catch(() => {
                enqueueSnackbar('Erro ao compartilhar local.', { variant: 'error' });
            });
        } else {
            enqueueSnackbar('Compartilhamento não suportado neste navegador.', { variant: 'info' });
        }
    };

    const handleAddToFavoritePlacesList = async () => {
        await favoritesLocationsList( localId );
    };

    const handleNextImage = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % local.Image.length);
    };

    const handlePreviousImage = () => {
        setImageIndex((prevIndex) => (prevIndex - 1 + local.Image.length) % local.Image.length);
    };

    const handleEventosAssociados = async () => {
        setVerEvents(!verEvents);
        try {
            await buscarEventosAssociados(localId);
        } catch (error) {
            console.error('Erro ao buscar eventos associados:', error);
        }
    };


    //reviews variaveis
    const [haveUserReview, setHaveUserReview] = useState(false);
    const [rating, setRating] = useState(1);
    const [hoverValue, setHoverValue] = useState(undefined);
    const [comment, setComment] = useState('');
    const { verReviews, addReview, deleteReview, localReview, info, isLoadingAddReview, isLoadingReview, errorAddReview, errorReview } = useReviewActions(localId);

    useEffect(() => {
        const showReviews = async () => {
            try {
                await verReviews();
            } catch (error) {
                console.error('Error show reviews', error);
            }
        };
        showReviews();
    }, []);

    useEffect(() => {
        if (localReview && info) {
            const userReview = localReview.find(review => review.RevUserId._id.toString() === info.toString());
            setHaveUserReview(!!userReview);
        }
    }, [localReview, info]);

    //calcular a média das reviews do local
    useEffect(() => {
        const fetchReviews = () => {
            try {
                if (localReview ) {
                    if (localReview.length > 0) {
                        const totalRating = localReview.reduce((accumulator, review) => accumulator + review.classification, 0);
                        const avgRating = totalRating / localReview.length;
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
    }, [localReview]);

    const handleMouseOverStar = value => {
        console.log("Over  --- ",value + 1)
        setHoverValue(value);
    };
    
    const handleMouseLeaveStar = () => {
        setHoverValue(undefined);
    };
    
    const handleClickStar = value => {
        console.log("Click --- ",value + 1)
        setRating(value + 1);
        setHoverValue(undefined);
    };
    

    const handleClickEnviar = async () => {
        try {
            await addReview(rating, comment);
        } catch (error) {
            console.error('Erro ao adicionar revisão:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
        } catch (error) {
            console.error('Erro ao eliminar revisão:', error);
        }
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
                                    <div className={styles.localHeader}>
                                        <h2 className={styles.title}>{local.Name}</h2>

                                        { (!isLoadingReview||!isLoadingAddReview) &&
                                            errorReview ? (
                                                <p className="error">{errorReview}</p>
                                            ) : localReview ? (
                                            <div className={styles.reviewMedia}>
                                                {stars.map((star, index) => (
                                                    <FaStar
                                                        key={index}
                                                        size={20}
                                                        color={averageRating >= index + 1 ? colors.orange : colors.grey}
                                                    />
                                                ))}
                                                <div className={styles.reviewMediaText}>
                                                    <h3>({averageRating}, {localReview.length} avaliações)</h3>
                                                </div>
                                            </div>
                                            ) :(
                                                <div className={styles.reviewMedia}>
                                                    {stars.map((star, index) => (
                                                        <FaStar
                                                            key={index}
                                                            size={20}
                                                            color= {colors.grey}
                                                        />
                                                    ))}
                                                    <div className={styles.reviewMediaText}>
                                                        <h3>(0, 0 avaliações)</h3>
                                                    </div>
                                                </div>
                                                )
                                        }



                                        <div className={styles.botoesFavShare}>
                                            <FaShare onClick={handleShare} className={styles.shareIcon} />

                                            {errorInterested ? (
                                                <p className="error">{errorInterested}</p>
                                            ) : (
                                                <>
                                                    {check ? (
                                                        <FaBookmark onClick={handleAddToFavoritePlacesList} className={styles.fav} />
                                                    ) : (
                                                        <FaRegBookmark onClick={handleAddToFavoritePlacesList} className={styles.borderFav} />
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
                                            <img src={local.Image[imageIndex]} alt="Event image not found!" className={styles.localImage} />
                                            {local.Image.length > 1 && (
                                                <FaArrowRight className={`${styles.arrowIcon} ${styles.right}`} onClick={handleNextImage} />
                                            )}
                                        </div>
                                    }
                                    <div className={styles.localSpace}>
                                        <div className={styles.localDetailsLeft}>
                                            <p className={styles.category}>Categoria: {local.Type}</p>
                                            <p className={styles.description}>{local.Description}</p>
                                            <p className={styles.address}>Morada: {local.Address}</p>
                                        </div>
                                        <div className={styles.localDetailsRight}>
                                            <p className={styles.address}>Idade recomendada: {local.AgeRecomendation} </p>
                                            
                                            <div className={styles.creatorimage}>
                                                <div className={styles.imageLabel}>
                                                    {local.Creator.ProfileImage ?
                                                        <img src={local.Creator.ProfileImage} alt="Imagem do utilizador" />
                                                        : <FaUser className={styles.defaultAvatar} />
                                                    }
                                                </div>
                                                <div>
                                                    <p className={styles.creator}> {local.Creator.username} (Criador)</p>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    
                                    {local.Address && <MyMap address={local.Address} />}
                                    
                                    



                                    {isLoadingReview ? (
                                        <div className='spinner'></div>
                                    ) : errorReview ? (
                                        <p className="error">{errorReview}</p>
                                    ) : (
                                        <div className={styles.reviewContainer}>
                                            {isLoadingAddReview ? (
                                                <div className='spinner'></div>
                                            ) : (
                                                !haveUserReview && (
                                                    <div className={styles.userInsertReview}>
                                                        <div className={styles.starsSelf}>
                                                            <div className={styles.reviewClass}>
                                                                {stars.map((_, index) => {
                                                                    const starColor =  index < ((hoverValue !== undefined && hoverValue > rating) ? hoverValue : rating) ? colors.orange : colors.grey;
                                                                    console.log(index, starColor)
                                                                    return (
                                                                        <FaStar
                                                                            key={index}
                                                                            size={20}
                                                                            color={starColor}
                                                                            onClick={() => handleClickStar(index)}
                                                                            onMouseOver={() => handleMouseOverStar(index)}
                                                                            onMouseLeave={handleMouseLeaveStar}
                                                                        />
                                                                    );
                                                                })}
                                                                <p className={styles.estrelasclass} >({rating} Estrela{rating > 1 ? 's' : ''})</p>
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            placeholder="Conta-nos a tua opinião..."
                                                            rows="4"
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            className={styles.caixaTexto}
                                                        ></textarea>
                                                        <button onClick={handleClickEnviar} className={'defaultButton ' + styles.submitButton}>
                                                            Submeter
                                                        </button>
                                                        {errorAddReview && <p className="error">{errorAddReview}</p>}
                                                    </div>
                                                )
                                            )}
                                            <div className={styles.otherReviews}>
                                                <div className={styles.reviewList}>
                                                    <div className={styles.reviewTituloRev}>
                                                        <h2>Avaliações</h2>
                                                    </div>
                                                    {localReview.map((review, index) => (
                                                        <div key={index} className={styles.review}>
                                                            <div className={styles.reviewImagem}>
                                                                <div className={styles.imageLabelRev}>
                                                                    {review.RevUserId.ProfileImage ? (
                                                                        <img src={review.RevUserId.ProfileImage} alt="Imagem do utilizador" />
                                                                    ) : (
                                                                        <FaUser className={styles.defaultAvatarRev} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className={styles.reviewTexto}>
                                                                <div className={styles.titulo}>
                                                                    <div className={styles.Nome}>
                                                                        <h3>{review.RevUserId.username}</h3>
                                                                        {review.RevUserId._id === info && (
                                                                            
                                                                            <div className={styles.buttonDelete}>
                                                                                <MdOutlineDeleteForever size={20} onClick={() => handleDeleteReview(review._id)}>Apagar</MdOutlineDeleteForever>
                                                                            </div>
                                                                            
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className={styles.reviewClass}>
                                                                        <div className={styles.reviewStars}>
                                                                            {Array(5).fill(0).map((_, i) => (
                                                                                <FaStar
                                                                                    key={i}
                                                                                    size={15}
                                                                                    color={review.classification >= i + 1 ? colors.orange : colors.grey}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        
                                                                        <p className={styles.estrelasclass2}>({review.classification} Estrelas)</p>
                                                                        
                                                                    </div>
                                                                    <p className= {styles.comment}>{review.comment}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}




                                </>
                            ) : (
                                <p> Nenhum local encontrado! </p>
                            )}
                        </>
                    )}
                
                </div>
                <div className={styles.eventAssoc}>
                {!isLoading && (
                    <>
                        {verEvents ? (
                            <>
                                {isLoadingEvents ? (
                                    <div className='spinner'></div>
                                ) : (
                                    <>
                                        {errorEvents ? (
                                            <p className="error">{errorEvents}</p>
                                        ) : associatedEvents.length > 0 ? (
                                            <div className={styles.eventsList}>
                                                <h3>Eventos Associados:</h3>
                                                {associatedEvents.map((event, index) => (
                                                    <Eventscard
                                                        key={index}
                                                        id={event._id}
                                                        evento={event.Name}
                                                        categoria={event.Type}
                                                        horainit={new Date(event.BegDate)}
                                                        horafinal={new Date(event.EndDate)}
                                                        morada={event.Address}
                                                        preco={event.Price}
                                                        organizador={event.username}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p>Nenhum evento ativo, associado ao local, encontrado!</p>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <p className={styles["button-text"]} onClick={handleEventosAssociados}>Ver eventos associados</p>
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
