import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useLocalDetails = () => {
    const [local, setLocal] = useState(null);
    const [counter, setcounter] = useState();// numero de pessoas interessadas
    const [check, setCheck] = useState(false); // verifica se o user está interessado
    const [isLoading, setIsLoading] = useState(null);
    const [errorBuscar, setErrorBuscar] = useState(null);
    const [errorInterested, setErrorInterested] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const buscarLocalDetails = async (localId) => {
        try {
            setIsLoading(true);
            let response;

            if (user) {
                // Obtenha o token JWT do localStorage
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage.token;

                response = await axios.get(`http://localhost:5555/locations/${localId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
            } else {
                response = await axios.get(`http://localhost:5555/locations/${localId}`);

            }

            if (response.status === 200) {
                setErrorBuscar(null);
                setLocal(response.data.local);
                console.log("responsedatalocal: ", response.data.local);
                //setcounter(response.data.local.InterestedUsers.length);
                setCheck(response.data.check)
            }
        } catch (error) {
            setErrorBuscar(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const favoritesLocationsList = async (localId, userId) => {
        try {
            const userLocalStorage = JSON.parse(localStorage.getItem('user'));

            if (!userLocalStorage || !userLocalStorage.token) {
                navigate("/login");
                return;
            }

            const token = userLocalStorage.token;

            // Se já deu like, remove o ID do usuário da lista
            const resp = await axios.put(
                `http://localhost:5555/locations/${localId}/addToFavorites`,
                { userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (resp.status === 200) {
                setErrorInterested(null);
                setcounter(resp.data.count);
                setCheck(resp.data.check);
            }
        } catch (error) {
            setErrorInterested(error.response ? error.response.data.message : "Error adding to favorites");
        }
    };


    return { buscarLocalDetails, favoritesLocationsList, local, counter, check, isLoading, errorBuscar, errorInterested }
}