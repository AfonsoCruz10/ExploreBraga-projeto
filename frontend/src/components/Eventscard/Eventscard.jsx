import styles from "./Eventscard.module.css"
import PropTypes from "prop-types";


function Eventscard({ data, categoria, evento, horainit, horafinal, morada, preco, organizador}){

    const precoFormatodo = preco.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })

    function mostrarHora({ horainit, horafinal }) {

        const horainitFormatada = horainit.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const horafinalFormatada = horafinal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (horainitFormatada === horafinalFormatada) {
            return horainitFormatada; 
        } else { 
            return `${horainitFormatada} - ${horafinalFormatada}`;
        }
    }

    return(
        
        <>
            <div className={styles.card}>
                
                <div className={styles.card1}> 
                    <p className={styles.carddata} > {data.toLocaleDateString()}</p>
                </div>
                
                <div className={styles.card2}> 
                    <p className={styles.cardcategoria} > {categoria} </p>
                    <p className={styles.cardtitle} > {evento} </p>
                    <p className={styles.cardtext} > {mostrarHora({horainit,horafinal})}</p>
                </div>

                <div className={styles.card3}> 
                    <p className={styles.cardtext} > {morada} </p>
                    <p className={styles.cardtext} > {precoFormatodo} </p>
                    <p className={styles.cardtext} > {organizador} </p>
                </div>
                
            </div>
            
        </>
    );
}

Eventscard.propTypes = {
    data: PropTypes.instanceOf(Date).isRequired, // Validar se data é uma instância de Date
    categoria: PropTypes.string.isRequired, // Validar se categoria é uma string
    evento: PropTypes.string.isRequired, // Validar se evento é uma string
    horainit: PropTypes.instanceOf(Date).isRequired, // Validar se horas é uma instância de Date
    horafinal: PropTypes.instanceOf(Date).isRequired, // Validar se horas é uma instância de Date
    morada: PropTypes.string.isRequired, // Validar se morada é uma string
    preco: PropTypes.number.isRequired, // Validar se preco é um número
    organizador: PropTypes.string.isRequired // Validar se organizador é uma string
};

Eventscard.defaultProps = {
    data: new Date(),
    categoria: 'Sem categoria',
    evento: 'Evento sem nome',
    horainit: new Date(),
    horafinal: new Date(),
    morada: 'Morada desconhecida',
    preco: 0,
    organizador: 'Organizador desconhecido'
  };

export default Eventscard