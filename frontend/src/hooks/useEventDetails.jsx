import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext.jsx';

export const useEventDetails = () => {
    const [event, setEvent] = useState(null);
    const [counter, setcounter] = useState();
    const [check, setCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [errorBuscar, setErrorBuscar] = useState(null);
    const [errorInterested, setErrorInterested] = useState(null);
    const { user } = useAuthContext();

    const buscarEventDetails = async (eventId) => {
        try {
            setIsLoading(true); 
            // Obtenha o token JWT do localStorage
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));
            const token = userLocalStorage.token; 

            const response = await axios.get(`http://localhost:5555/events/${eventId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    }
                });
            setEvent(response.data.event);
            // Atualiza o contador de likes com base na quantidade de usuários interessados
            setcounter(response.data.event.InterestedUsers.length);
            setCheck(response.data.check)
            setErrorBuscar(null);
        } catch (error) {
            setErrorBuscar(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const interested = async (eventId) => {
        try {
            setIsLoading(true);
            
            if(user){
                // Obtenha o token JWT do localStorage
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage.token; 

                // Se já deu like, remove o ID do usuário da lista
                const resp = await axios.put(`http://localhost:5555/events/${eventId}/interested`, 
                    null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    }
                );
                setcounter(resp.data.count);
                setCheck(resp.data.check);
                setErrorInterested(null);
            } else{
                setErrorInterested("Login first!")
            }
        } catch (error) {
            setErrorInterested(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {buscarEventDetails, interested, event, counter, check, isLoading, errorBuscar, errorInterested}
}