import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useEditLocation = (localId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationDetails, setLocationDetails] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    // Função para obter os detalhes do local com base no ID do local
    const getLocationDetails = async () => {
        try {
            setIsLoading(true);

            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            const res = await axios.get(`http://localhost:5555/locations/infoToEdit/${localId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
            });
            if (res.status === 200) {
                setError(null);
                setLocationDetails(res.data.local);
            }

        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para editar o local
    const editLocation = async (locationType, locationName, locationDescription, locationAge, locationAddress ,locationImage) => {
        try {
            setIsLoading(true);

            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            const res = await axios.put(`http://localhost:5555/locations/edit/${localId}`, {
                    locationType,
                    locationName,
                    locationDescription,
                    locationAge,
                    locationImage,
                    locationAddress
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
            });
            if (res.status === 200) {
                setError(null);
                enqueueSnackbar('Local atualizado com sucesso!', { variant: 'success' });
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { getLocationDetails, editLocation, isLoading, error, locationDetails };
};

