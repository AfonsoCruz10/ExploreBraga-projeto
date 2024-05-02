import { useState } from 'react';
import axios from 'axios';

export const useSelectLocation = () => {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectLocationsConnect = async () => {
        setIsLoading(true);
        const url = `http://localhost:5555/locations/seebycategories`;
        try {
            const response = await axios.get(url);
            if (response.status === 200) {
                setError(null);
                setLocations(response.data.data);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { selectLocationsConnect, locations, isLoading, error };
};
