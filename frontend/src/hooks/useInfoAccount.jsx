import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext'; 

export const useInfoAccount = () => {
    const [info, setInfo] = useState({});
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState('');
    const { dispatch } = useAuthContext();
    const [errorNewEmail, setErrorNewEmail] = useState('');
    const [errorNewUsername, setErrorNewUsername] = useState('');

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

            if (response.status === 200) {
                setError(null);
                setInfo(response.data.data);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateUserInfo = async (newUsername, newEmail) => {
        try {
            setIsLoading(true);
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;
            
            const response = await axios.put(`http://localhost:5555/users/updateAccount`, 
                    { newUsername, newEmail },{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                setErrorNewEmail(null);
                setErrorNewUsername(null);
                
                // Armazene o novo token no armazenamento local
                const newToken = response.data.token;

                localStorage.setItem("user", JSON.stringify({ token: newToken }));

                // Atualize o contexto de autenticação com o novo token
                dispatch({ type: `LOGIN`, payload: newToken });

                // Atualize o estado do usuário com os novos dados
                setInfo(response.data.user);
            }
        } catch (error) {
            if (newUsername === ""){
                setErrorNewEmail(error.response.data.message);
            }else{
                setErrorNewUsername(error.response.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { useraccountConnect, updateUserInfo, info, isLoading, error, errorNewEmail, errorNewUsername}
}