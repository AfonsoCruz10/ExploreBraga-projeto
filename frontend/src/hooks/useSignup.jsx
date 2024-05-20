import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useSignUp = () => {
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const signupConnection = async ( username, email, password, confirmPassword, birthDate) => {
        try {
            setIsLoading(true);

            if (password === confirmPassword){
                const response = await axios.post('http://localhost:5555/users/createNewUser', {username, email, password, birthDate});
                if (response.status === 201) {
                    setError(null);
                    navigate('/login');
                    enqueueSnackbar('Registo bem-sucedido!', { variant: 'success' });
                }
            } else {
                setError("Diferent passwords");
                setIsLoading(false);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {signupConnection, isLoading, error}
}