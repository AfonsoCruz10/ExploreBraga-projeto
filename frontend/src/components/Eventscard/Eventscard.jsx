import styles from "./Eventscard.module.css";
import PropTypes from "prop-types";

function Eventscard({ categoria, evento, horainit, horafinal, morada, preco, organizador }) {
  const precoFormatado = preco.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

  // Função para formatar hora
  function mostrarHora({ horainit, horafinal }) {
    const horainitFormatada = horainit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const horafinalFormatada = horafinal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (horainitFormatada === horafinalFormatada) {
      return horainitFormatada;
    } else {
      return `${horainitFormatada} - ${horafinalFormatada}`;
    }
  }

  return (
    <>
      <div className={styles.card}>
        <div className={styles.card1}>
          <p className={styles.carddata}>{horainit.toLocaleDateString()}</p>
        </div>

        <div className={styles.card2}>
          <p className={styles.cardcategoria}>{categoria}</p>
          <p className={styles.cardtitle}>{evento}</p>
          <p className={styles.cardtext}>{mostrarHora({ horainit, horafinal })}</p>
        </div>

        <div className={styles.card3}>
          <p className={styles.cardtext}>{morada}</p>
          <p className={`${styles.cardtext} ${preco === 0 ? styles.gratis : ''}`}>{preco === 0 ? 'Grátis' : precoFormatado}</p>
          <p className={styles.cardtext}>{organizador}</p>
        </div>
      </div>
    </>
  );
}

Eventscard.propTypes = {
  categoria: PropTypes.string.isRequired,
  evento: PropTypes.string.isRequired,
  horainit: PropTypes.instanceOf(Date).isRequired,
  horafinal: PropTypes.instanceOf(Date).isRequired,
  morada: PropTypes.string.isRequired,
  preco: PropTypes.number.isRequired,
  organizador: PropTypes.string.isRequired
};

export default Eventscard;
