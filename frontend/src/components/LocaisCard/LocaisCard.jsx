import styles from "./LocaisCard.module.css";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

function LocaisCard({ id, Type, Name, Creator, Adress }) {
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.card} onClick={() => navigate(`/locations/${id}`)}>

                <div className={styles.card1}>
                    <p className={styles.cardcategoria}>{Type}</p>
                    <p className={styles.cardtitle}>{Name}</p>
                </div>

                <div className={styles.card2}>
                    <p className={styles.cardtext}>{Creator}</p>
                    <p className={styles.cardtext}>{Adress}</p>
                </div>
            </div>
        </>
    );
}

LocaisCard.propTypes = {
    id: PropTypes.string.isRequired,
    Type: PropTypes.string.isRequired,
    Name: PropTypes.string.isRequired,
    Adress: PropTypes.string.isRequired,
    Creator: PropTypes.string.isRequired
};

export default LocaisCard;
