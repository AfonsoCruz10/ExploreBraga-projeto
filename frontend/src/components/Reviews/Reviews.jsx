import { useEffect, useState, useRef } from 'react';
import styles from './Reviews.module.css';
import { FaUser, FaStar, FaEdit } from "react-icons/fa";
import { MdOutlineDeleteForever, MdPerson3 } from "react-icons/md";
import { useReviewActions } from '../../hooks/useReviewActions';

function Reviews({ reviews, localId, averageRating, username, userId }) {
    const [haveUserReview, setHaveUserReview] = useState(false);
    const [userNewReview, setUserNewReview] = useState('');
    const [rating, setRating] = useState(1);
    const [hoverValue, setHoverValue] = useState(undefined);
    const [comment, setComment] = useState('');
    const { addReview, updateReview, deleteReview, seeReview } = useReviewActions();
    const [editingReview, setEditingReview] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [originalReviewText, setOriginalReviewText] = useState('');
    const textAreaRef = useRef(null);

    const stars = Array(5).fill(0);
    const colors = {
        orange: "#F2C265",
        grey: "a9a9a9"
    }

    // verifica se o utilizador já fez uma review
    useEffect(() => {
        const userReview = reviews.find(review => review.username === username);
        setHaveUserReview(userReview === undefined ? false : true);
    }, [reviews, username]);

    // Atualiza a altura do textarea conforme o conteúdo inserido
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [userNewReview]);


    const handleMouseOverStar = value => {
        setHoverValue(value)
    };

    const handleMouseLeaveStar = () => {
        setHoverValue(rating)
    }

    const handleClickStar = value => {
        if (value === rating) {
            // Se o valor selecionado for menor que o rating atual,
            // defina o rating para o novo valor e remova o hoverValue
            setRating(value);
            setHoverValue(undefined);
        } else {
            // Caso contrário, apenas defina o rating para o novo valor
            setRating(value);
        }
    };

    const handleClickEnviar = async () => {
        try {
            await addReview(localId, userId, rating, comment);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao adicionar revisão:', error);
            // Implemente a lógica para lidar com erros, se necessário
        }
    };

    // Função para lidar com o clique no botão "Editar" para editar uma review 
    const handleEditReview = async (reviewId, reviewText) => {
        if (editingReview && editingReviewId === reviewId) {
            // Se já estiver editando esta revisão, saia do modo de edição
            setEditingReview(false);
            setEditingReviewId(null);
            setUserNewReview('');
        } else {
            // Se não estiver editando esta revisão, comece a edição
            setOriginalReviewText(reviewText);
            setUserNewReview(reviewText);
            setEditingReview(true);
            setEditingReviewId(reviewId);
        }
    };


    // Função para lidar com o clique no botão "Guardar" para editar uma review
    const handleSaveChanges = async () => {
        try {
            await updateReview(userId, localId, editingReviewId, rating, userNewReview);
            // Reinicializa os estados relacionados à edição
            setUserNewReview('');
            setEditingReview(false);
            setEditingReviewId(null);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao editar revisão:', error);
        }
    };

    // Função para lidar com o clique no botão "Apagar" para excluir uma review
    const handleDeleteReview = async (reviewId) => {
        console.log("Excluir revisão com ID:", reviewId);
        try {
            await deleteReview(userId, localId, reviewId);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao editar revisão:', error);
        }
    };

    return (
        <div className={styles.reviewContainer}>
            {/* Se o utilizador ainda não tiver feito uma review, mostra o formulário de inserir review */}
            {!haveUserReview && (
                <div className={styles.userInsertReview}>
                    <div className={styles.starsSelf}>
                        <div className={styles.reviewClass}>
                            {Array(5).fill(0).map((_, index) => {
                                const starColor = index < rating ? colors.orange : colors.grey;
                                return (
                                    <FaStar
                                        key={index}
                                        size={22}
                                        color={starColor}
                                        onClick={() => handleClickStar(index + 1)}
                                        onMouseOver={() => handleMouseOverStar(index + 1)}
                                        onMouseLeave={handleMouseLeaveStar}
                                    />
                                );
                            })}
                            {rating == 1 ? <p>({rating} Estrela)</p> : <p>({rating} Estrelas)</p>}

                        </div>
                    </div>
                    <textarea
                        placeholder="Conta-nos a tua opinião..."
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button onClick={handleClickEnviar}>Guardar</button>
                </div>
            )}
            <div className={styles.otherReviews}>
                <div className={styles.reviewList}>
                    <div className={styles.reviewMedia}>
                        <h3>Avaliações</h3>
                    </div>
                    {reviews.map((review, index) => (
                        <div key={index} className={styles.review}>
                            <div className={styles.reviewImagem}>
                                <div className={styles.imageLabel}>
                                    {review.profilePhoto ?
                                        <img src={review.profilePhoto} alt="Imagem do utilizador" />
                                        : <FaUser className={styles.defaultAvatar} />
                                    }
                                </div>
                            </div>
                            <div className={styles.reviewTexto}>
                                <div className={styles.titulo}>
                                    <div className={styles.Nome}>
                                        <h2>{review.username}</h2>
                                        {review.username === username && (
                                            <div className={styles.buttons}>
                                                <div className={styles.buttonEdit}>
                                                    <FaEdit size={18} onClick={() => handleEditReview(review._id, review.comment)}>Editar</FaEdit>
                                                </div>
                                                <div className={styles.buttonDelete}>
                                                    <MdOutlineDeleteForever size={21} onClick={() => handleDeleteReview(review._id)}>Apagar</MdOutlineDeleteForever>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {editingReview && editingReviewId === review._id ? (
                                        <div>
                                            <div className={styles.reviewClass}>
                                                {Array(5).fill(0).map((_, index) => {
                                                    const starColor = index < rating ? colors.orange : colors.grey;
                                                    return (
                                                        <FaStar
                                                            key={index}
                                                            size={20}
                                                            color={starColor}
                                                            onClick={() => handleClickStar(index + 1)}
                                                            onMouseOver={() => handleMouseOverStar(index + 1)}
                                                            onMouseLeave={handleMouseLeaveStar}
                                                        />
                                                    );

                                                })}
                                                <p>({rating} Estrelas)</p>
                                            </div>

                                            <textarea
                                                ref={textAreaRef}
                                                value={userNewReview}
                                                onChange={(e) => setUserNewReview(e.target.value)}
                                            />
                                            <button onClick={() => handleSaveChanges()}>Guardar</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className={styles.reviewClass}>
                                                <div className={styles.reviewStars}>
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            size={20}
                                                            color={review.classification >= i + 1 ? colors.orange : colors.grey}
                                                        />
                                                    ))}
                                                </div>
                                                <div>
                                                    <p>({review.classification} Estrelas)</p>
                                                </div>
                                            </div>
                                            <p>{review.comment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reviews;
