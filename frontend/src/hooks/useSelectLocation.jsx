import { useState } from 'react';
import axios from 'axios';

export const useSelectLocation = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [favoriteLocations, setFavoriteLocations] = useState([]);
    const [errorFav, setErrorFav] = useState(null);
    
    const selectLocationsConnect = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5555/locations/seebycategories`);
            if (response.status === 200) {
                setError(null);
                setLocations(response.data.data);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };


    const getFavoriteLocations = async () => {
        try {
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));

            if (!userLocalStorage || !userLocalStorage.token) {
                setErrorFav('Usuário não autenticado.');
            }
            const token = userLocalStorage.token;

            const response = await axios.get('http://localhost:5555/users/userFavoritePlaces', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setErrorFav(null);
                setFavoriteLocations(response.data.data);
            }
        } catch (error) {
            setErrorFav(error.response.data.message);
        }
    };

    return { selectLocationsConnect, getFavoriteLocations, favoriteLocations, errorFav, locations, isLoading, error };
};
