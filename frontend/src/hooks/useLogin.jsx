import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext'; 
import { useSnackbar } from 'notistack';

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext(); 
    const { enqueueSnackbar } = useSnackbar();

    const loginConnection = async (email, password, remember) => {
        try {
            setIsLoading(true);
            const res = await axios.post('http://localhost:5555/users/login', {email, password, remember});
            
            if (res.status === 200) {

                // Salve o usuário no localStorage
                localStorage.setItem("user", JSON.stringify(res.data));

                // Atualize o contexto de autenticação
                dispatch({type:`LOGIN`, payload: res.data});
                
                setError(null);
                enqueueSnackbar('Login bem-sucedido!', { variant: 'success' });
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { loginConnection, isLoading, error };
}
