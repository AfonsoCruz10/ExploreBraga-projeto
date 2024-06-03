import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useEditEvent = (eventId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    const [locais, setLocais] = useState(null);
    const [errorLocais, setErrorLocais] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    // Função para obter os detalhes do evento com base no ID do evento
    const getEventDetails = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:5555/events/${eventId}`);
            if(res.status === 200){
                setEventDetails(res.data.event); 
                setError(null);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para editar o evento
    const editEvent = async (eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAge, eventPrice, eventImage, eventAddress, eventLocAssoc) => {
        try {
            setIsLoading(true);
            
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            const res = await axios.put(`http://localhost:5555/events/edit/${eventId}`, {
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

            },{
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (res.status === 200) {
                setError(null);
                enqueueSnackbar('Evento atualizado com sucesso!', { variant: 'success' }); 
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false); 
        }
    };

    const buscarLocais = async () => {
        try {
            
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
        }
    };

    return { getEventDetails, editEvent, buscarLocais, locais, isLoading, error, errorLocais, eventDetails };
};
