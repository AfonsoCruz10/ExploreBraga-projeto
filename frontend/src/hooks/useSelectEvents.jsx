import { useState } from 'react';
import axios from 'axios';

export const useSelectEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectEventsonnect = async () => {
        setIsLoading(true);
        try {
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;   

            const response = await axios.get('http://localhost:5555/events/SelectEvents', {
              headers: {
                  'Authorization': `Bearer ${token}` 
              }
            }); 
            setEvents(response.data.data);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { selectEventsonnect, events, isLoading, error };
};
