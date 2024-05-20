import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

export const useAdmin = () => {
  const [adminEvents, setAdminEvents] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const adminUsersConnect = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Obtenha o token JWT do localStorage
      const userLocalStorage = JSON.parse(localStorage.getItem('user'));
      const token = userLocalStorage.token;

      const response = await axios.get('http://localhost:5555/admin/displayAllUsers', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if(response.status === 200){
        setError(null);
        setAdminUsers(response.data.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const adminEventsConnect = async () => {
    try {
      setIsLoadingEvents(true);
      
      // Obtenha o token JWT do localStorage
      const userLocalStorage = JSON.parse(localStorage.getItem('user'));
      const token = userLocalStorage.token;

      const response = await axios.get('http://localhost:5555/admin/events', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      if(response.status === 200){
        setError(null);
        setAdminEvents(response.data.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const eventAction = async (eventId, action) => {
    try {
      setIsLoadingEvents(true);

      // Obtenha o token JWT do localStorage
      const userLocalStorage = JSON.parse(localStorage.getItem('user'));
      const token = userLocalStorage.token;

      // Faça a solicitação POST para realizar a ação no evento com o ID fornecido
      const response = await axios.put(`http://localhost:5555/admin/events/${eventId}/${action}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        let statusEvent = ""; 

        if(action === 'accept'){
          statusEvent = 'Active'
        }else if(action === 'cancel'){
          statusEvent = 'Canceled'
        }else{
          statusEvent = 'Pending'
        }
        enqueueSnackbar(`Estado do evento atualizado para ${statusEvent}`, { variant:'success' });
        await adminEventsConnect();
      }
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar os estado do evento', { variant: 'error' });
    } finally {
      setIsLoadingEvents(false);
    }
  };

  return { adminUsersConnect, adminEventsConnect, eventAction, adminEvents, adminUsers, isLoadingEvents, isLoadingUsers, error };
};
