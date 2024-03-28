import style from "./Events.module.css"
import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Eventscard from "../../components/Eventscard/Eventscard.jsx";
import Modal from "react-modal";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const categoriaslista = [
  <Eventscard evento="Maratona" categoria="Desporto" />,
  <Eventscard data={new Date("2024-02-05")} evento="Xau" categoria="Educacao" />,
  <Eventscard
    data={new Date("2024-01-06")} 
    categoria="Cultura" 
    evento="Igrejas" 
    horainit={new Date("2024-02-20T08:00:00")} 
    horafinal={new Date("2024-02-20T10:00:00")} 
    morada="Rua das Corridas, 123" 
    preco={10} 
    organizador="Associação de Corridas de Braga" 
  />,
  <Eventscard evento="Passaros" categoria="Fotografia" />,
  <Eventscard evento="Brocas" categoria="Lazer" />,
  <Eventscard evento="Bom Jesus" categoria="Turismo" />,
  <Eventscard
    data={new Date("2024-04-06")} 
    categoria="Desporto" 
    evento="Corrida de 5km" 
    horainit={new Date("2024-02-20T08:00:00")} 
    horafinal={new Date("2024-02-20T10:00:00")} 
    morada="Rua das Corridas, 123" 
    preco={10} 
    organizador="Associação de Corridas de Braga" 
  />,
  <Eventscard evento="Tempo" categoria="Cultura" />
];

Modal.setAppElement("#root");

function Events() {
  const [searchCat, setSearchCat] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleChangeCat = (event) => {
    setSearchCat(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const filteredEvents = categoriaslista.filter(evento => {
    // Verifica se a categoria está vazia ou se corresponde à categoria selecionada
    const categoriaMatch = searchCat === "" || evento.props.categoria === searchCat; 
    // Verifica se a data corresponde à data selecionada, ou se não há data selecionada
    const dataMatch = !selectedDate || evento.props.data.getFullYear() === selectedDate.getFullYear() && evento.props.data.getMonth() === selectedDate.getMonth() && evento.props.data.getDate() === selectedDate.getDate();
    // Filtrar apenas datas futuras
    const futureDate = evento.props.data >= new Date(new Date().setHours(0,0,0,0));
    // Retorna true se não houver filtro de categoria selecionado OU
    // se a categoria do evento corresponder à categoria selecionada E a data do evento corresponder à data selecionada, ou não houver data selecionada
    return categoriaMatch && dataMatch && futureDate;
  });
  
  // Ordenar eventos por data
  filteredEvents.sort((a, b) => new Date(a.props.data) - new Date(b.props.data));

  const categoriasFiltradasJSX = filteredEvents.map((evento, index) => (
    <div key={index}>{evento}</div>
  ));

  return (
    <div className="body">
      <Header />
      <div className={style.events}>
        <h1 style={{ fontFamily: 'Arial, sans-serif', fontSize: '60px', padding: '35px', marginBottom: '5px' }}>Events</h1>

        <p className={style["button-text"]} onClick={openModal}> Abrir Filtros </p>

          <Modal
              isOpen={modalOpen}
              onRequestClose={closeModal}
              overlayClassName={style["ReactModal__Overlay"]} 
              className={style["ReactModal__Content"]} 
            >
              
            <span className={style["close-button"]} onClick={closeModal}>&times;</span>
            
            <div className={style["search-container"]}>
              <select value={searchCat} onChange={handleChangeCat} className={style.caixaevents}>
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
                className={style["calendarioE"]}
              />
            </div>
          </Modal>
        
        <div>{categoriasFiltradasJSX}</div>
      </div>
    </div>
  );
}

export default Events;
