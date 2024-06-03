import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const useCreatEvent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [locais, setLocais] = useState([]);
    const [errorLocais, setErrorLocais] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const createEvent = async (eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAge, eventPrice, eventImage, eventAddress, eventLocAssoc) => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            const res = await axios.post('http://localhost:5555/events/create', {
                eventType,
                eventName,
                eventBegDate,
                eventEndDate,
                eventDescription,
                eventAge,
                eventPrice,
                eventImage,
                eventAddress,
                eventLocAssoc
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 201) {
                setError(null);
                enqueueSnackbar('Evento criado com sucesso!', { variant: 'success' });
                navigate('/useraccount');
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const buscarLocais = async () => {
        try {
            setIsLoading(true);
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            const res = await axios.get(`http://localhost:5555/events/buscarLocaisEvents`,{
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (res.status === 200) {
                setErrorLocais(null);
                setLocais(res.data.locations);
            }
        } catch (error) {
            setErrorLocais(error.response.data.message);
        } finally {
            setIsLoading(false);
        }

    };
    return { createEvent, buscarLocais, locais, isLoading, error, errorLocais};
}
