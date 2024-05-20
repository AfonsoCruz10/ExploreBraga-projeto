
import { useAuthContext } from './useAuthContext';
import { useSnackbar } from 'notistack';

export const useLogOut = () => {
    const { dispatch } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();

    const logOutConnection = () => {
        try {
            //Remove user from storage
            localStorage.removeItem(`user`);
            
            //Dispath logout action
            dispatch({type:`LOGOUT`})

            // Exibe uma mensagem de sucesso
            enqueueSnackbar('Logout bem-sucedido!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao fazer logout.', { variant: 'error' });
        }
    };

    return { logOutConnection };
};
