import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export const useLocalDetails = () => {
    const [local, setLocal] = useState(null);
    const [check, setCheck] = useState(false); 
    const [associatedEvents, setAssociatedEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(null);;
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [errorBuscar, setErrorBuscar] = useState(null);
    const [errorInterested, setErrorInterested] = useState(null);
    const [errorEvents, setErrorEvents] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();

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
                setCheck(response.data.check)
            }
        } catch (error) {
            setErrorBuscar(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    };

    const favoritesLocationsList = async ( localId ) => {
        try {

            if(user){
                // Obtenha o token JWT do localStorage
                const userLocalStorage = JSON.parse(localStorage.getItem('user'));
                const token = userLocalStorage.token; 

                // Se já deu like, remove o ID do usuário da lista
                const resp = await axios.put(
                    `http://localhost:5555/locations/addToFavorites/${localId}`,
                    null,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (resp.status === 200) {
                    setErrorInterested(null);
                    setCheck(resp.data.check);
                    if (!check){
                        enqueueSnackbar("Local adicionado da sua lista de favoritos", { variant: "success" });
                    } else{
                        enqueueSnackbar("Local removido da sua lista de favoritos", { variant: "success" });
                    }
                }
            } else{
                navigate("/login");
            }

        } catch (error) {
            enqueueSnackbar("Erro ao adiconar/remover o local à sua lista de favoritos", { variant: "error" });
            setErrorInterested(error.response ? error.response.data.message : "Error adding to favorites");
        }
    };


    const buscarEventosAssociados = async (localId) => {
        setIsLoadingEvents(true);
        setErrorEvents(null);
        try {
            const response = await axios.get(`http://localhost:5555/locations/assocEvents/${localId}`);
            setAssociatedEvents(response.data.events);
        } catch (error) {
            setErrorEvents(error.response.data.message);
        } finally {
            setIsLoadingEvents(false);
        }
    };
    
    return { buscarLocalDetails, favoritesLocationsList, buscarEventosAssociados, local, associatedEvents, check, isLoading, isLoadingEvents, errorBuscar, errorInterested, errorEvents }
}