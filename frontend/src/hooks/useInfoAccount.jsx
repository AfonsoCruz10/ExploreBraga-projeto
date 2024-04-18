import { useState } from 'react';
import axios from 'axios';

export const useInfoAccount = () => {
    const [info, setInfo] = useState({});
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState('');

    const useraccountConnect = async () => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;   

            const response = await axios.get("http://localhost:5555/users/myaccount", {
              headers: {
                  'Authorization': `Bearer ${token}` 
              }
            });
            setInfo(response.data.data);
            
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {useraccountConnect, info, isLoading, error}
}