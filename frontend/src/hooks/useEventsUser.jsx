import { useState } from 'react';
import axios from 'axios';

export const useUserEvents = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorDelete, setErrorDelete] = useState(null);

    const userEventsConnect = async () => {
        try {
            setIsLoading(true);
            
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;   

            const response = await axios.get('http://localhost:5555/users/showEventsUser', {
              headers: {
                  'Authorization': `Bearer ${token}` 
              }
            }); 
            setUserEvents(response.data.data);
            
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setError(null);
            setIsLoading(false);
        }
    };

 
    const eventDelete = async (eventId) => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            // Faça a solicitação DELETE para excluir o evento com o ID fornecido
            await axios.delete(`http://localhost:5555/events/eventDelet`, {
                data: { eventId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            setErrorDelete(error.response.data.message);
        } finally{
            setErrorDelete(null);
        }
    };

    return { userEventsConnect, eventDelete, userEvents, isLoading, error, errorDelete };
};
