import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useAdmin = () => {
  const [adminEvents, setAdminEvents] = useState([]);
  const [adminLocations, setAdminLocations] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [errorEvents, setErrorEvents] = useState(null);
  const [errorLocations, setErrorLocations] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getAuthToken = () => {
    const userLocalStorage = JSON.parse(localStorage.getItem('user'));
    return userLocalStorage?.token;
  };

  const adminUsersConnect = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Obtenha o token JWT do localStorage
      const token = getAuthToken();

      const response = await axios.get('http://localhost:5555/admin/displayAllUsers', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if(response.status === 200){
        setErrorUsers(null);
        setAdminUsers(response.data.data);
      }
    } catch (error) {
      setErrorUsers(error.response.data.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const adminEventsConnect = async () => {
    try {
      setIsLoadingEvents(true);
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5555/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setErrorEvents(null);
        setAdminEvents(response.data.data);
      } 
    } catch (error) {
      setErrorEvents(errorMessage);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const adminLocationsConnect = async () => {
    try {
      setIsLoadingLocations(true);
      
      // Obtenha o token JWT do localStorage
      const token = getAuthToken();

      const response = await axios.get('http://localhost:5555/admin/locations', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if(response.status === 200){
        setErrorLocations(null);
        setAdminLocations(response.data.data);
      }
    } catch (error) {
      setErrorLocations(error.response.data.message);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const eventAction = async (eventId, action) => {
    try {
      setIsLoadingEvents(true);

      // Obtenha o token JWT do localStorage
      const token = getAuthToken();
      
      // Faça a solicitação POST para realizar a ação no evento com o ID fornecido
      const response = await axios.put(`http://localhost:5555/admin/eventAction/${eventId}/${action}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        let statusEvent = ""; 

        if(action === 'accept'){
          statusEvent = 'Active'
        } else{
          statusEvent = 'Pending'
        }
        await adminEventsConnect();
        enqueueSnackbar(`Estado do evento atualizado para ${statusEvent}`, { variant:'success' });
      }
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar os estado do evento', { variant: 'error' });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const locAction = async (localId, action) => {
    try {
      setIsLoadingLocations(true);

      // Obtenha o token JWT do localStorage
      const token = getAuthToken();

      // Faça a solicitação POST para realizar a ação no evento com o ID fornecido
      const response = await axios.put(`http://localhost:5555/admin/locationAction/${localId}/${action}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        let statusLoc = ""; 

        if(action === 'accept'){
          statusLoc = 'Active'
        } else{
          statusLoc = 'Pending'
        }
        await adminLocationsConnect();
        enqueueSnackbar(`Estado do local atualizado para ${statusLoc}`, { variant:'success' });
      }
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar os estado do local', { variant: 'error' });
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const eventDelete = async (eventId) => {
    try {
        setIsLoadingEvents(true);

        // Obtenha o token JWT do localStorage

        const token = getAuthToken(); 

        // Faça a solicitação DELETE para excluir o evento com o ID fornecido
        const response = await axios.delete(`http://localhost:5555/admin/eventDelet`, {
            data: { eventId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if(response.status === 200){
             // Atualiza a lista de eventos do usuário após a exclusão bem-sucedida
             setAdminEvents((prevEvents) => prevEvents.filter(event => event._id !== eventId));
             enqueueSnackbar('Evento excluído com sucesso!', { variant: 'success' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        enqueueSnackbar('Erro ao excluir evento.', { variant: 'error' });
    } finally{
        setIsLoadingEvents(false);
    }
  };

  const localDelete = async (localId) => {
    try {
        setIsLoadingLocations(true);

        // Obtenha o token JWT do localStorage
        const token = getAuthToken(); 

        // Faça a solicitação DELETE para excluir o evento com o ID fornecido
        const response = await axios.delete(`http://localhost:5555/admin/locationDelete`, {
            data: { localId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            // Atualiza a lista de eventos do usuário após a exclusão bem-sucedida
            setAdminLocations((prevLocals) => prevLocals.filter(local => local._id !== localId));
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
        setIsLoadingLocations(false);
    }
  };

  return { adminUsersConnect, adminEventsConnect, adminLocationsConnect, eventAction, locAction, eventDelete, localDelete, adminEvents, adminUsers, adminLocations, isLoadingEvents, isLoadingUsers,isLoadingLocations,  errorEvents, errorLocations, errorUsers};
};
