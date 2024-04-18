import { useState } from 'react';
import axios from 'axios';

export const useCreatEvent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createEvent = async (eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAge, eventPrice, eventImage, eventAdress) => {
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
                eventAdress
            }, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            if (res.status === 200) {
                console.log("Evento criado com sucesso");
            }
            setError(null);
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { createEvent, isLoading, error };
}
