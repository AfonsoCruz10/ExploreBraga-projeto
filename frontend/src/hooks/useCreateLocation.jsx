import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const useCreateLocation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const createLocation = async (locationType, locationName, locationDescription, locationAge, locationImage, locationAdress) => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            const res = await axios.post('http://localhost:5555/locations/create', {
                locationType,
                locationName,
                locationDescription,
                locationAge,
                locationImage,
                locationAdress
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 201) {
                setError(null);
                enqueueSnackbar('Local criado com sucesso!', { variant: 'success' });
                navigate('/useraccount');
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { createLocation, isLoading, error };
}
