import { useState } from 'react';
import axios from 'axios';

export const useAdmin = () => {
  const [adminEvents, setAdminEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorAction, setErrorAction] = useState(null);

  const adminUsersConnect = async () => {
    try {
      setIsLoading(true);
      
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
        setAdminEvents(response.data.data);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };


  const adminEventsConnect = async () => {
    try {
      setIsLoading(true);
      
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
      setIsLoading(false);
    }
  };

  const adminEventsPendingConnect = async () => {
    try {
      setIsLoading(true);
      
      // Obtenha o token JWT do localStorage
      const userLocalStorage = JSON.parse(localStorage.getItem('user'));
      const token = userLocalStorage.token;

      const response = await axios.get('http://localhost:5555/admin/events/pending', {
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
      setIsLoading(false);
    }
  };

  const adminEventsActiveConnect = async () => {
    try {
      setIsLoading(true);
      
      // Obtenha o token JWT do localStorage
      const userLocalStorage = JSON.parse(localStorage.getItem('user'));
      const token = userLocalStorage.token;

      const response = await axios.get('http://localhost:5555/admin/events/active', {
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
      setIsLoading(false);
    }
  };


  const eventAction = async (eventId, action) => {
    try {
      setIsLoading(true);

      // Obtenha o token JWT do localStorage
      const userLocalStorage = JSON.parse(localStorage.getItem('user'));
      const token = userLocalStorage.token;

      // Faça a solicitação POST para realizar a ação no evento com o ID fornecido
      await axios.put(`http://localhost:5555/admin/events/${eventId}/${action}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setErrorAction(null);
    } catch (error) {
      setErrorAction(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };



  return { adminUsersConnect, adminEventsConnect, adminEventsPendingConnect, adminEventsActiveConnect, eventAction, adminEvents, isLoading, error, errorAction };
};
