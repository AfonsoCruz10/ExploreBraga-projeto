import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useEventDetails = () => {
    const [event, setEvent] = useState(null);
    const [counter, setcounter] = useState();// numero de pessoas interessadas
    const [check, setCheck] = useState(false); // verifica se o user está interessado
    const [isLoading, setIsLoading] = useState(null);
    const [errorBuscar, setErrorBuscar] = useState(null);
    const [errorInterested, setErrorInterested] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const buscarEventDetails = async (eventId) => {
        try {
            setIsLoading(true); 
            let response;

            if(user){
                // Obtenha o token JWT do localStorage
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage.token; 

                response = await axios.get(`http://localhost:5555/events/${eventId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}` 
                        }
                    });
            } else{
                response = await axios.get(`http://localhost:5555/events/${eventId}`);
               
            }

            if (response.status === 200) {
                setErrorBuscar(null);
                setEvent(response.data.event);
                setcounter(response.data.event.InterestedUsers.length);
                setCheck(response.data.check)
            }
        } catch (error) {
            setErrorBuscar(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const interested = async (eventId) => {
        try {
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
                if (resp.status === 200) {
                    setErrorInterested(null);
                    setcounter(resp.data.count);
                    setCheck(resp.data.check)
                }
            } else{
                navigate("/login");
            }
        } catch (error) {
            setErrorInterested(error.response.data.message);
        } 
    };

    return {buscarEventDetails, interested, event, counter, check, isLoading,  errorBuscar, errorInterested}
}