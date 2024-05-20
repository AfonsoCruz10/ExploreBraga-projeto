import { useState } from 'react';
import axios from 'axios';

export const useReviewActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const seeReview = async (locationId, reviewId) => {
        try {
            setLoading(true);
            setError(null); // Reset error state before making request

            const res = await axios.get(`http://localhost:5555/locations/${locationId}/seeReview/${reviewId}`);

            if (res.status === 200) {
                return res.data.review;
            } else {
                setError(`Error: ${res.status}`);
            }
        } catch (err) {
            console.error("Erro ao ver revisão:", err);
            setError(err.response?.data?.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    const addReview = async (locationId, userId, classification, comment) => {
        try {
            setLoading(true);
            setError(null); // Reset error state before making request

            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage?.token;

            if (!token) {
                throw new Error("Token not found");
            }

            const res = await axios.post(`http://localhost:5555/locations/${locationId}/addReview`, {
                userId,
                classification,
                comment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 201) {
                return res.data.review;
            } else {
                setError(`Error: ${res.status}`);
            }
        } catch (err) {
            console.error("Erro ao adicionar revisão:", err);
            setError(err.response?.data?.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    const updateReview = async (userId, locationId, reviewId, classification, comment) => {
        try {
            setLoading(true);
            setError(null); // Reset error state before making request

            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage?.token;

            if (!token) {
                throw new Error("Token not found");
            }

            const res = await axios.put(`http://localhost:5555/locations/${locationId}/editReview/${reviewId}`, {
                userId,
                classification,
                comment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                return res.data.review;
            } else {
                setError(`Error: ${res.status}`);
            }
        } catch (err) {
            console.error("Erro ao atualizar revisão:", err);
            setError(err.response?.data?.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    const deleteReview = async (userId, locationId, reviewId) => {
        try {
            setLoading(true);
            setError(null); // Reset error state before making request

            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage?.token;

            if (!token) {
                throw new Error("Token not found");
            }

            const res = await axios.delete(`http://localhost:5555/locations/${locationId}/deleteReview/${reviewId}`, {
                data: { userId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                return res.data.message;
            } else {
                setError(`Error: ${res.status}`);
            }
        } catch (err) {
            console.error("Erro ao deletar revisão:", err);
            setError(err.response?.data?.message || "Erro desconhecido");
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, addReview, updateReview, deleteReview, seeReview };
}
