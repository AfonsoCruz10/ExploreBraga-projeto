import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useSignUp = () => {
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signupConnection = async ( username, email, password) => {
        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:5555/users/createNewUser', {username, email, password});
            if (response.status === 201) {
                console.log("Usuário criado com sucesso", response.data);
            }
            setError(null);
            navigate('/login');
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {signupConnection, isLoading, error}
}