import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header/Header.jsx";
import Eventscard from "../../components/Eventscard/Eventscard.jsx";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Events.module.css";
import { useSelectEvents } from '../../hooks/useSelectEvents.jsx';

Modal.setAppElement("#root");

function Events() {
  const [searchCat, setSearchCat] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventsToShow, setEventsToShow] = useState(5);
  const { selectEventsonnect, events, isLoading, error } = useSelectEvents();

  useEffect(() => {
    selectEventsonnect();
  }, []);

  const handleChangeCat = (event) => {
    setSearchCat(event.target.value);
  };

  const handleDateChange = (date) => {
    if (selectedDate !== null) {
      const selectedDay = selectedDate.getDate();
      const newDay = date.getDate();
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

  const handleLoadMore = () => {
    setEventsToShow(eventsToShow + 5);
  };
  
  const filteredEvents = events.filter((evento) => {
    const categoriaMatch = searchCat === "" || evento.Type === searchCat;
    const dataMatch = !selectedDate || new Date(evento.BegDate).toDateString() === selectedDate.toDateString();
    return categoriaMatch && dataMatch;
  }).slice(0, eventsToShow);

  return (
    <>
    <Header />
    <div className="body">
      
      <div className={styles.events}>
        <h1 className="titulo">Eventos</h1>

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
              <option value ="Educacao">Educação</option>
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

        {isLoading ? (
            <div className='spinner'></div>
          ) : error ? (
            {error}
          ) : (
            <>
              <div>
                {events.length ? (
                  filteredEvents.map((event, index) => (
                    <Eventscard
                      key={index}
                      id={event._id}
                      evento={event.Name} 
                      categoria={event.Type} 
                      horainit={new Date(event.BegDate)} 
                      horafinal={new Date(event.EndDate)} 
                      morada={event.Address} 
                      preco={event.Price} 
                      organizador={event.Creator} 
                    />
                  ))
                ) : (
                  <p>Nenhum evento Ativo encontrado!</p>
                )}
              </div>

              {eventsToShow < events.length && (
                <button onClick={handleLoadMore}>Carregar mais</button>
              )}
            </>
          )}
      </div>
    </div>
    </>
  );
}

export default Events;
