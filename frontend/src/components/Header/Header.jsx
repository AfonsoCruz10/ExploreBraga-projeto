import Button_Route from "../Button_Route";
import Data from "./Data";
import Temp from "./Temp";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import styles from "./Header.module.css"; // Import styles from Header.module.css

function Header() {
    const [estaAberto, setEstaAberto] = useState(false);

    const toggleAberto = () => {
        setEstaAberto(!estaAberto);
    };
    
    return (
        <>
            <div className={styles["header-line"]}>
                <Button_Route page="/home" class_button={styles.home} />
                <div className={styles["menu-info"]}>
                    <Data />
                    <Temp name={styles.temperatura}/>
                </div>
                <div className={styles["menu-links"]}>
                    <a href="/about"> ABOUT US </a>
                    <a href="/login"> <FaRegUser/> </a>
                </div>
                <button className={styles["menu-drop"]} onClick={toggleAberto}>
                    <FiMenu />
                </button>
                <div className={`${styles["menu-tabela"]} ${estaAberto ? styles.open : ''}`}>
                    <a href="/home"><div className={styles["menu-tabela-button"]}>HOME</div></a>
                    <a href="/events"><div className={styles["menu-tabela-button"]}>EVENTS</div></a>
                    <a href="/locations"><div className={styles["menu-tabela-button"]}>LOCATIONS</div></a>
                    <a href="/about"><div className={styles["menu-tabela-button"]}>ABOUT US</div></a>
                    <a href="/login"><div className={styles["menu-tabela-button"]}>LOGIN</div></a>
                </div>
            </div>
            <hr className={styles["upper-line"]} />
        </>
    );
}

export default Header;
