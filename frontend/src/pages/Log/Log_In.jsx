import style from "./Log_In.module.css"
import Header from "../../components/Header/Header.jsx";
import SignUpForm from "../../components/SignUpForm.jsx";

/*
Vai conter uma forma de registro (Henrique the builder)
*/
function Log_In(){
    return (
        <>
        <Header/>
        <div className={style.SignUp}>
            <SignUpForm/>
        </div>
        </>
    );
}

export default Log_In