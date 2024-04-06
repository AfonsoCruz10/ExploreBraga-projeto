import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header/Header.jsx";
import Eventscard from "../../components/Eventscard/Eventscard.jsx";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Events.module.css";

Modal.setAppElement("#root");

function Events() {
  const [searchCat, setSearchCat] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]); 

  useEffect(() => {
    // Função assíncrona para buscar eventos do backend
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5555/events/SelectEvents");
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };
    fetchEvents();
  }, []); // Array vazio como segundo argumento para garantir que a função seja executada apenas uma vez

  const handleChangeCat = (event) => {
    setSearchCat(event.target.value);
  };

  const handleDateChange = (date) => {
    if (selectedDate !== null){
      // Extrair o dia da data selecionada e da data atual
      const selectedDay = selectedDate.getDate();
      const newDay = date.getDate();
      
      // Verificar se os dias são iguais
      if (selectedDay === newDay) {
        setSelectedDate(null); 
      } else {
        setSelectedDate(date);
      }
    } else {
      setSelectedDate(date); 
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Filtra os eventos com base nas opções selecionadas de categoria e data
  const filteredEvents = events.filter((evento) => {
    // Verifica se a categoria está vazia ou se corresponde à categoria selecionada
    const categoriaMatch = searchCat === "" || evento.Type === searchCat;
    // Verifica se a data corresponde à data selecionada, ou se não há data selecionada
    const dataMatch = !selectedDate || new Date(evento.BegDate).toDateString() === selectedDate.toDateString();
    // Retorna true se não houver filtro de categoria selecionado OU
    // se a categoria do evento corresponder à categoria selecionada e a data do evento corresponder à data selecionada, ou não houver data selecionada
    return categoriaMatch && dataMatch;
  });

  // Ordena os eventos por data
  filteredEvents.sort(
    (a, b) => new Date(a.BegDate) - new Date(b.BegDate)
  );

  return (
    <div className="body">
      <Header />
      <div className={styles.events}>
        <h1 style={{ fontFamily: 'Arial, sans-serif', fontSize: '60px', padding: '35px', marginBottom: '5px' }}>Events</h1>

        <p className={styles["button-text"]} onClick={openModal}> Abrir Filtros </p>

          <Modal
              isOpen={modalOpen}
              onRequestClose={closeModal}
              overlayClassName={styles["ReactModal__Overlay"]} 
              className={styles["ReactModal__Content"]} 
            >
              
            <span className={styles["close-button"]} onClick={closeModal}>&times;</span>
            
            <div className={styles["search-container"]}>
              <select value={searchCat} onChange={handleChangeCat} className={styles.caixaevents}>
                <option value="">Escolha uma categoria</option>
                <option value="Cultura">Cultura</option>
                <option value="Desporto">Desporto</option>
                <option value="Educacao">Educação</option>
                <option value="Fotografia">Fotografia</option>
                <option value="Lazer">Lazer</option>
                <option value="Turismo">Turismo</option>
              </select>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                minDate={new Date()}
                formatShortWeekday={(locale, date) => {
                  const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
                  return weekdays[date.getDay()];
                }}
                className={styles["calendarioE"]}
              />
            </div>
          </Modal>
        
        <div>
          {filteredEvents.map((event, index) => (
            <Eventscard
              key={index}
              evento={event.Name} 
              categoria={event.Type} 
              horainit={new Date(event.BegDate)} 
              horafinal={new Date(event.EndDate)} 
              morada={event.Address} 
              preco={event.Price} 
              organizador={event.Creator} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
