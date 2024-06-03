import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useUserLocations = () => {
    const [userLocations, setUserLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const userLocationsConnect = async () => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            if (!userLocalStorage || !userLocalStorage.token) {
                throw new Error('Usuário não autenticado.');
            }
            const token = userLocalStorage.token;

            const response = await axios.get('http://localhost:5555/users/showLocationsUser', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setError(null);
                setUserLocations(response.data.data);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError('Ocorreu um erro ao conectar-se às localizações do usuário.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const localDelete = async (localId) => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            // Faça a solicitação DELETE para excluir o evento com o ID fornecido
            const response = await axios.delete(`http://localhost:5555/locations/locationDelete`, {
                data: { localId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                // Atualiza a lista de eventos do usuário após a exclusão bem-sucedida
                setUserLocations((prevLocals) => prevLocals.filter(local => local._id !== localId));
                enqueueSnackbar('Local excluído com sucesso!', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            if (error.response && error.response.data) {
                enqueueSnackbar(error.response.data.message, { variant: 'error' });
            } else {
                enqueueSnackbar('Erro ao excluir evento.', { variant: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { userLocationsConnect, localDelete, userLocations, isLoading, error };
};
