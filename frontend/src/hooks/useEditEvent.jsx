import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useEditEvent = (eventId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    const navigate = useNavigate();

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
    const editEvent = async (eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAge, eventPrice, eventImage, eventAddress) => {
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
                eventAddress
            },{
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false); 
        }
    };

    return { getEventDetails, editEvent, isLoading, error, eventDetails };
};
