import styles from "./Eventscard.module.css";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

function Eventscard({ id, categoria, evento, horainit, horafinal, morada, preco, organizador, onClick }) {
  const precoFormatado = preco.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  const navigate = useNavigate();
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

  // Função para formatar data
  function formatarData(data) {
    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const diaSemana = diasDaSemana[data.getDay()];
    return `${diaSemana}`;
  }

  return (
    <>
      <div className={styles.card} onClick={() => navigate(`/events/${id}`)}>
        <div className={styles.card1}>
          <p className={styles.carddata}>{formatarData(horainit)}</p>
          <p className={styles.carddata}>{ new Date(horainit).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) }</p>
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
  id: PropTypes.string.isRequired,
  categoria: PropTypes.string.isRequired,
  evento: PropTypes.string.isRequired,
  horainit: PropTypes.instanceOf(Date).isRequired,
  horafinal: PropTypes.instanceOf(Date).isRequired,
  morada: PropTypes.string.isRequired,
  preco: PropTypes.number.isRequired,
  organizador: PropTypes.string.isRequired
};

export default Eventscard;
