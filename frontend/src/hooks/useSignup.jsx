import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useSignUp = () => {
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const signupConnection = async ( username, email, password, confirmPassword, birthDate) => {
        try {
            setIsLoading(true);

            if (password === confirmPassword){
                const response = await axios.post('http://localhost:5555/users/createNewUser', {username, email, password, birthDate});
                if (response.status === 201) {
                    console.log("Usuário criado com sucesso", response.data);
                }
            } else {
                setError("Diferent passwords");
                setIsLoading(false);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setError(null);
            setIsLoading(false);
            navigate('/login');
        }
    };

    return {signupConnection, isLoading, error}
}