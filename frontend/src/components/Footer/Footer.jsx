import React, { useState } from 'react';
import styles from "./Footer.module.css";
import emailjs from '@emailjs/browser'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'; 
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useSnackbar } from 'notistack'; 

function Footer() {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
            
      emailjs.send('service_786rw6o', 'template_xqp5yqy', { message: feedback }, 'Y1HHkUwmfLSbdepgA')
        .then(() => {
          setFeedback("");
          enqueueSnackbar('Feedback enviado com sucesso!', { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar('Erro ao enviar feedback.', { variant: 'error' });
        });

    } catch (error) {
      enqueueSnackbar('Erro ao enviar feedback.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <hr className={styles.bottomline} />
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.suggestions}>
            <h2>Sugestões</h2>
            <form onSubmit={handleSubmit}>
              <textarea 
                className={styles.textarea} 
                placeholder="Deixe-nos suas sugestões e o seu feedback!" 
                value={feedback} 
                onChange={(e) => setFeedback(e.target.value)}
                rows="4"
                required
              />
              <button type="submit" className={styles.enviar} disabled={isLoading}>Enviar</button>
            </form>
          </div>
          {/* Seção de links para rotas */}
          <div className={styles.routes}>
            <h2>Páginas</h2>
            <ul>
              <li><a href="/events" className={styles.a}>Eventos</a></li>
              <li><a href="/locations" className={styles.a}>Locais</a></li>
              <li><a href="/about" className={styles.a}>Sobre nós</a></li>
            </ul>
          </div>
          
          {/* Seção de contactos */}
          <div className={styles.contactos}>
            <h2>Contactos</h2>
            <ul>
              <li>
                <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                <a href="tel:+351999999999" className={styles.a}>+351 999 999 999</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                <a href="mailto:explorebraga@gmail.com" className={styles.a}>explorebraga@gmail.com</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faInstagram} className={styles.icon} />
                <a href="https://www.instagram.com/" className={styles.a} target="_blank" rel="noopener noreferrer">Siga-nos no Instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className={styles.finalline} />
        <div className={styles.copyright}>
          <p>© 2024 - Todos os direitos reservados</p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
