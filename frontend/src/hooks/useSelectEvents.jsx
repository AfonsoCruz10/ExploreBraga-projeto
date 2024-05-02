import { useState } from 'react';
import axios from 'axios';

export const useSelectEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectEventsonnect = async () => {
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

    return { selectEventsonnect, events, isLoading, error };
};
