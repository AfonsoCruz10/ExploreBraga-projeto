import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useUserEvents = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const userEventsConnect = async () => {
        try {
            setIsLoading(true);
            
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;   

            const response = await axios.get('http://localhost:5555/users/showEventsUser', {
              headers: {
                  'Authorization': `Bearer ${token}` 
              }
            });
            if(response.status === 200){
                setError(null);
                setUserEvents(response.data.data);
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

 
    const eventDelete = async (eventId) => {
        try {
            setIsLoading(true);

            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token;

            // Faça a solicitação DELETE para excluir o evento com o ID fornecido
            const response = await axios.delete(`http://localhost:5555/events/eventDelet`, {
                data: { eventId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.status === 200){
                 // Atualiza a lista de eventos do usuário após a exclusão bem-sucedida
                 setUserEvents((prevEvents) => prevEvents.filter(event => event._id !== eventId));
                 enqueueSnackbar('Evento excluído com sucesso!', { variant: 'success' });
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            enqueueSnackbar('Erro ao excluir evento.', { variant: 'error' });
        } finally{
            setIsLoading(false);
        }
    };

    return { userEventsConnect, eventDelete, userEvents,  isLoading, error };
};
