import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

export const useReviewActions = (localId) => {
    const [localReview, setLocalReview] = useState([]);
    const [info, setInfo] = useState(null);
    const [isLoadingReview, setIsLoadingReview] = useState(false);
    const [isLoadingAddReview, setIsLoadingAddReview] = useState(false);
    const [errorReview, setErrorReview] = useState(null);
    const [errorAddReview, setErrorAddReview] = useState(null);
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const verReviews = async () => {
        try {
            setIsLoadingReview(true);
            let response;

            if (user) {
                // Obtenha o token JWT do localStorage
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage.token;

                response = await axios.get(`http://localhost:5555/locations/reviews/${localId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                response = await axios.get(`http://localhost:5555/locations/reviews/${localId}`);
            }

            if (response.status === 200) {
                setErrorReview(null);
                setLocalReview(response.data.reviews.Reviews);
                setInfo(response.data.userId);
            }
        } catch (error) {
            setErrorReview(error.respons.data.message);
        } finally {
            setIsLoadingReview(false);
        }
    };

    const addReview = async (classification, comment) => {
        try {
            setIsLoadingAddReview(true);
            if(user){
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage?.token;

                const res = await axios.post(`http://localhost:5555/locations/reviews/addReview/${localId}`, {
                    classification,
                    comment
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.status === 201) {
                    setErrorAddReview(null);
                    enqueueSnackbar("Obrigado pelo sua avaliação!", { variant: "success" });
                    await verReviews();
                } 
            } else {
                navigate("/login");
            }
        } catch (error) {
            setErrorAddReview(error.response.data.message);
        } finally {
            setIsLoadingAddReview(false);
        }
    }

    const deleteReview = async (reviewId) => {
        try {
            if(user){
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage?.token;

                const res = await axios.delete(`http://localhost:5555/locations/reviews/deleteReview`, {
                    data: { localId , reviewId},
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.status === 200) {
                    setLocalReview((prevReviews) => prevReviews.filter(review => review._id !== reviewId));
                    enqueueSnackbar("Avaliação eliminada com sucesso!", { variant: "success" });
                } 
            } else {
                navigate("/login");
            }
        } catch (error) {
            enqueueSnackbar("Erro ao eliminar avalição!", { variant: "error" });
            console.error("Erro ao deletar revisão:", error);
        } 
    }

    return { verReviews, addReview, deleteReview, localReview, info, isLoadingAddReview, isLoadingReview, errorAddReview, errorReview };
}
