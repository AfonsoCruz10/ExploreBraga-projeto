
import { useState } from 'react';
import axios from 'axios';

export const useSelectEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [interestedEvents, setInterestedEvents] = useState([]);
    const [errorInt, setErrorInt] = useState(null);

    const selectEventsConnect = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5555/events/SelectEvents'); 
            if (response.status === 200) {
                setError(null);
                setEvents(response.data.data);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };


    const getInterestedEvents = async () => {
        try {
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));

            if (!userLocalStorage || !userLocalStorage.token) {
                setErrorInt('Usuário não autenticado.');
                return;
            }
            const token = userLocalStorage.token;

            const response = await axios.get('http://localhost:5555/users/userInterestedEvents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setErrorInt(null);
                setInterestedEvents(response.data.data);
            }
        } catch (error) {
            setErrorInt(error.response.data.message);
        } 
    };

    return { selectEventsConnect, getInterestedEvents, interestedEvents, errorInt, events, isLoading, error };
};
