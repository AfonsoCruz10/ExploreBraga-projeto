import React, { useEffect, useState } from 'react';
import Header from "../../components/Header/Header.jsx";
import { useAdmin } from '../../hooks/useAdmin.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfo, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from "./AdminPage.module.css";
import { useNavigate } from 'react-router-dom';
import Modal from "react-modal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Footer from "../../components/Footer/Footer.jsx";

Modal.setAppElement("#root");

function AdminPage() {
    const { adminUsersConnect, adminEventsConnect, eventAction, adminEvents, adminUsers, isLoadingEvents, isLoadingUsers, error } = useAdmin();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('events');
    const [modalOpen, setModalOpen] = useState(false);
    const [searchCat, setSearchCat] = useState('');
    const [searchEventName, setSearchEventName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                
                await adminEventsConnect();
            
                await adminUsersConnect();
                
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };
    
        fetchData();
    }, []);

    const openModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleAction = async (eventId, action) => {
        try {
            await eventAction(eventId, action);
        } catch (error) {
            console.error('Error performing action on event:', error);
        }
    };

    const handleChangeCat = (event) => {
        setSearchCat(event.target.value);
    };

    const handleInputChange = (e) => {
        setSearchEventName(e.target.value);
    };

    const handleStatus = (e) => {
        setSearchStatus(e.target.value);
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

    const filteredEvents = adminEvents.filter((evento) => {
        const categoriaMatch = searchCat === "" || evento.Type === searchCat;
        const statusMatch = searchStatus === "" || evento.Status === searchStatus;
        const dataMatch = !selectedDate || new Date(evento.BegDate) >= selectedDate;
        const eventNameMatch = evento.Name.toLowerCase().includes(searchEventName.toLowerCase());
        return categoriaMatch && dataMatch && eventNameMatch && statusMatch;
    });

    return (
        <>
            <Header />
            <div className="body">
                <h2 className="titulo">Administração</h2>
                <div className={"defaultContainer " + styles.adminEventsContainer}>

                    <div className={styles.sectionButtonContainer}>
                        <span
                            className={activeSection === 'events' ? styles.activeButton : styles.sectionButton}
                            onClick={() => setActiveSection('events')}
                        >
                            Eventos
                        </span>
                        <span
                            className={activeSection === 'users' ? styles.activeButton : styles.sectionButton}
                            onClick={() => setActiveSection('users')}
                        >
                            Usuários
                        </span>
                    </div>
                    
                    {/* Seção de eventos pendentes*/}
                    {activeSection === 'events' && (
                        <>
                            {isLoadingEvents ? (
                                <div className='spinner'></div>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : (
                                <>
                                <div className={styles.Wrapper}>

                                    <div className= {styles.searchInputs}>
                                        <input type="text" placeholder="Pesquisar por evento ..." name="eventName" value={searchEventName} onChange={handleInputChange} className={'defaultInput ' + styles.inputField}/>
                                        
                                        <select value={searchStatus} onChange={handleStatus} className={styles.select + ' defaultselect'}>
                                          <option value="">Pesquisar por estado</option>
                                          <option value="Active">Active</option>
                                          <option value="Pending">Pending </option>
                                        </select>
                                    </div>
                                
                                    <p className={styles["button-text"]} onClick={openModal}> Abrir Filtros </p>
                                </div>

                                <Modal
                                  isOpen={modalOpen}
                                  onRequestClose={openModal}
                                  overlayClassName={styles["ReactModal__Overlay"]}
                                  className={styles["ReactModal__Content"]}
                                >
                                
                                  <span className={styles["close-button"]} onClick={openModal}>&times;</span>

                                  <div className={styles["search-container"]}>
                                    <select value={searchCat} onChange={handleChangeCat} className={styles.select2 + ' defaultselect'}>
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


                                {filteredEvents.length !== 0 ? (
                                    <>
                                    <table className='defaultTable '>
                                        {/* Cabeçalho da tabela */}
                                        <thead>
                                            <tr>
                                                <th>Nome do Evento</th>
                                                <th>Tipo</th>
                                                <th>Data de Início/fim</th>
                                                <th>Estado</th>
                                                <th>Username</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        {/* Corpo da tabela */}
                                        <tbody>
                                            {filteredEvents.map(event => (
                                                <tr key={event._id}>
                                                    <td>{event.Name}</td>
                                                    <td>{event.Type}</td>
                                                    <td>{new Date(event.BegDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {new Date(event.EndDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                    <td>{event.Status}</td>
                                                    <td>{event.username}</td>
                                                    <td>
                                                        {/* Botões de ação */}
                                                        <button onClick={() => handleAction(event._id, 'accept')} className={styles.buttonAccept}>
                                                            <FontAwesomeIcon icon={faCheck} /> Aceitar
                                                        </button>
                                                        <button onClick={() => handleAction(event._id, 'pending')} className={styles.buttonPending}>
                                                            <FontAwesomeIcon icon={faSpinner} /> Pendente
                                                        </button>
                                                        <button onClick={() => handleAction(event._id, 'cancel')} className={styles.buttonCancel}>
                                                            <FontAwesomeIcon icon={faTimes} /> Cancelar
                                                        </button>
                                                        <button onClick={() => navigate(`/events/${event._id}`)} className={styles.buttonInfo}>
                                                            <FontAwesomeIcon icon={faInfo} /> Detalhes
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </>
                                ) : (
                                    <p>Nenhum evento pendente encontrado!</p>
                                )}
                                </>
                            )}
                        </>
                    )}

                    {/* Seção de User*/}
                    {activeSection === 'users' && (
                        <>
                            {isLoadingUsers ? (
                                <div className='spinner'></div>
                            ) : error ? (
                                <p className="error">{error}</p>
                            ) : adminUsers.length !== 0 ? (
                                <table className='defaultTable '>
                                    <thead>
                                        <tr>
                                            <th>Nome de Usuário</th>
                                            <th>Email</th>
                                            <th>Data de Nascimento</th>
                                            
                                        </tr>
                                    </thead>
                                   
                                    <tbody>
                                        {adminUsers.map(user => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className={styles.avatarWrapper}>
                                            
                                                        <label className={styles.avatarLabel}>  
                                                            {user.ProfileImage ?
                                                                <img src={user.ProfileImage} alt="Avatar do usuário"/>
                                                                : <FontAwesomeIcon icon={faUser} className={styles.defaultAvatar} />
                                                            }
                                                        </label>
                                                        
                                                        <p className={styles.creator}>{user.username}</p>
                                                    </div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>{new Date(user.birthDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Nenhum user encontrado!</p>
                            )}
                        </>
                    )}
                    

                </div>
            </div>
            <Footer />
        </>
    );
}

export default AdminPage;
