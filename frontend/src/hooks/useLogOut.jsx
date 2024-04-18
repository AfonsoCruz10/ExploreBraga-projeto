// useLogOut.jsx
import { useAuthContext } from './useAuthContext';

export const useLogOut = () => {
    const {dispatch} = useAuthContext();

    const logOutConnection = () => {

        //Remove user from storage
        localStorage.removeItem(`user`);
        
        //Dispath logout action
        dispatch({type:`LOGOUT`})
    };

    return { logOutConnection };
}
