import { useState } from 'react';
import axios from 'axios';

export const useUserEvents = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const userEventsConnect = async () => {
        setIsLoading(true);
        try {
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;   

            const response = await axios.get('http://localhost:5555/users/showEventsUser', {
              headers: {
                  'Authorization': `Bearer ${token}` 
              }
            }); 
            setUserEvents(response.data.data);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { userEventsConnect, userEvents, isLoading, error };
};
