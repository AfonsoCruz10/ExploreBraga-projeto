import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './comum_pages.css';
import { AuthContextProvider } from './context/AuthContext.jsx';
import {SnackbarProvider} from 'notistack';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SnackbarProvider maxSnack={1} autoHideDuration={3000}>
        <App />
      </SnackbarProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
