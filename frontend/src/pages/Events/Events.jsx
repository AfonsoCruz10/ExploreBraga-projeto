// Eventos.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Eventscard from "../../components/Eventscard/Eventscard.jsx";
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Events.module.css";
import { SlArrowDown } from 'react-icons/sl';
import { useSelectEvents } from '../../hooks/useSelectEvents.jsx';
import Footer from "../../components/Footer/Footer.jsx";
import { useAuthContext } from "../../hooks/useAuthContext.jsx";

Modal.setAppElement("#root");

function Events() {
  const [searchEventName, setSearchEventName] = useState('');
  const [searchCat, setSearchCat] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventsToShow, setEventsToShow] = useState(5);
  const { selectEventsConnect, getInterestedEvents, interestedEvents, errorInt, events, isLoading, error } = useSelectEvents();
  const { user } = useAuthContext();

  useEffect(() => {
    const showEvents = async () => {
      try {
        await selectEventsConnect();
      } catch (error) {
        console.error('Error show events', error);
      }
    };
    showEvents();
  }, []);

  useEffect(() => {
    const showInterestedEvents = async () => {
        try {
            await getInterestedEvents();
        } catch (error) {
            console.error('Error show interested events', error);
        }
    };
    if (user) {
        showInterestedEvents();
    }
  }, [user]);

  const handleChangeCat = (event) => {
    setSearchCat(event.target.value);
  };

  const handleInputChange = (e) => {
    setSearchEventName(e.target.value);
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
    const categoriaMatch = searchCat === "" || (searchCat === "Favoritos" ? interestedEvents.some(fav => fav._id === evento._id) : evento.Type === searchCat);
    const dataMatch = !selectedDate || new Date(evento.BegDate) >= selectedDate;
    const eventNameMatch = evento.Name.toLowerCase().includes(searchEventName.toLowerCase());
    return categoriaMatch && dataMatch && eventNameMatch;
  }).slice(0, eventsToShow);

  return (
    <>
      <Header />
      <div className="body">

        <div className={styles.events}>
          <h1 className="titulo">Eventos</h1>

          <div className={styles.Wrapper}>
            <input type="text" placeholder="Pesquisar por evento ..." name="eventName" value={searchEventName} onChange={handleInputChange} className={'defaultInput ' + styles.inputField}/>
            
            <p className={styles["button-text"]} onClick={openModal}> Abrir Filtros </p>
          </div>
          
          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            overlayClassName={styles["ReactModal__Overlay"]}
            className={styles["ReactModal__Content"]}
          >

            <span className={styles["close-button"]} onClick={closeModal}>&times;</span>

            <div className={styles["search-container"]}>
              {!user ? 
                <select value={searchCat} onChange={handleChangeCat} className={styles.select + ' defaultselect'}>
                  <option value="">Escolha uma categoria</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Desporto">Desporto</option>
                  <option value="Educacao">Educação</option>
                  <option value="Fotografia">Fotografia</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Turismo">Turismo</option>
                </select>
                : errorInt ? (
                    <p className="error">{errorInt}</p>
                ) :
                  <select value={searchCat} onChange={handleChangeCat} className={styles.select + ' defaultselect'}>
                      <option value="">Escolha uma categoria</option>
                      <option value="Cultura">Cultura</option>
                      <option value="Desporto">Desporto</option>
                      <option value="Educacao">Educação</option>
                      <option value="Fotografia">Fotografia</option>
                      <option value="Lazer">Lazer</option>
                      <option value="Turismo">Turismo</option>
                      <option value="Favoritos">Eventos Favoritos</option>
                  </select>
              }
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
            <p className="error">{error}</p>
          ) : (
            <div>
              {filteredEvents.length ? (
                <>
                  {filteredEvents.map((event, index) => (
                    <Eventscard
                      key={index}
                      id={event._id}
                      evento={event.Name}
                      categoria={event.Type}
                      horainit={new Date(event.BegDate)}
                      horafinal={new Date(event.EndDate)}
                      morada={event.Address}
                      preco={event.Price}
                      organizador={event.username}
                    />
                  ))}

                  {filteredEvents.length >= eventsToShow && events.length > eventsToShow  && (
                    <div className={styles.Arrow} onClick={handleLoadMore}>
                      <SlArrowDown /> 
                    </div>
                  )}
                </>
              ) : (
                <p>Nenhum evento ativo encontrado!</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Events;
