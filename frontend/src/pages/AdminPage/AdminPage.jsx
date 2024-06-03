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
    const { adminUsersConnect, adminEventsConnect, adminLocationsConnect, eventAction, locAction, eventDelete, localDelete, adminEvents, adminUsers, adminLocations, isLoadingEvents, isLoadingUsers,isLoadingLocations,  errorEvents, errorLocations, errorUsers} = useAdmin();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('events');
    const [modalOpen, setModalOpen] = useState(false);
    const [searchCatEvent, setSearchCatEvent] = useState('');
    const [searchEventName, setSearchEventName] = useState('');
    const [searchStatusEvent, setSearchStatusEvent] = useState('');
    const [searchCatLocal, setSearchCatLocal] = useState('');
    const [searchLocalName, setSearchLocalName] = useState('');
    const [searchStatusLocal, setSearchStatusLocal] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {

                await adminEventsConnect();
                
                
            } catch (error) {
                console.error('Error fetching admin data events:', error);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                await adminLocationsConnect();
                
                
            } catch (error) {
                console.error('Error fetching admin data locations:', error);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {

                await adminUsersConnect();

                
            } catch (error) {
                console.error('Error fetching admin data Users:', error);
            }
        };
    
        fetchData();
    }, []);

    const openModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleActionEvents = async (eventId, action) => {
        try {
            await eventAction(eventId, action);
        } catch (error) {
            console.error('Error performing action on event:', error);
        }
    }; 

    const handleActionLocations = async (locationId, action) => {
        try {
            await locAction(locationId, action);
        } catch (error) {
            console.error('Error performing action on location:', error);
        }
    };

    const handleChangeCatEvent = (e) => {
        setSearchCatEvent(e.target.value);
    };

    const handleInputChangeEvent = (e) => {
        setSearchEventName(e.target.value);
    };

    const handleStatusEvent = (e) => {
        setSearchStatusEvent(e.target.value);
    };

    const handleChangeCatLoc = (e) => {
        setSearchCatLocal(e.target.value);
    };

    const handleInputChangeLoc = (e) => {
        setSearchLocalName(e.target.value);
    };

    const handleStatusLoc = (e) => {
        setSearchStatusLocal(e.target.value);
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
        const categoriaMatch = searchCatEvent === "" || evento.Type === searchCatEvent;
        const statusMatch = searchStatusEvent === "" || evento.Status === searchStatusEvent;
        const dataMatch = !selectedDate || new Date(evento.BegDate) >= selectedDate;
        const eventNameMatch = evento.Name.toLowerCase().includes(searchEventName.toLowerCase());
        return categoriaMatch && dataMatch && eventNameMatch && statusMatch;
    });

    const filteredLocations = adminLocations.filter((loc) => {
        const categoriaMatch = searchCatLocal === "" || loc.Type === searchCatLocal;
        const statusMatch = searchStatusLocal === "" || loc.Status === searchStatusLocal;
        const NameMatch = loc.Name.toLowerCase().includes(searchLocalName.toLowerCase());
        return categoriaMatch && NameMatch && statusMatch;
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
                            className={activeSection === 'locations' ? styles.activeButton : styles.sectionButton}
                            onClick={() => setActiveSection('locations')}
                        >
                            Locais
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
                            ) : errorEvents ? (
                                <p className="error">{errorEvents}</p>
                            ) : (
                                <>
                                <div className={styles.Wrapper}>

                                    <div className= {styles.searchInputs}>
                                        <input type="text" placeholder="Pesquisar por evento ..." value={searchEventName} onChange={handleInputChangeEvent} className={'defaultInput ' + styles.inputField}/>
                                        
                                        <select value={searchStatusEvent} onChange={handleStatusEvent} className={styles.select + ' defaultselect'}>
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
                                    <select value={searchCatEvent} onChange={handleChangeCatEvent} className={styles.select2 + ' defaultselect'}>
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
                                                        <button onClick={() => handleActionEvents(event._id, 'accept')} className={styles.buttonAccept}>
                                                            <FontAwesomeIcon icon={faCheck} /> Aceitar
                                                        </button>
                                                        <button onClick={() => handleActionEvents(event._id, 'pending')} className={styles.buttonPending}>
                                                            <FontAwesomeIcon icon={faSpinner} /> Pendente
                                                        </button>
                                                        <button onClick={() => eventDelete(event._id)} className={styles.buttonCancel}>
                                                            <FontAwesomeIcon icon={faTimes} /> Eliminar
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
                                    <p>Nenhum evento encontrado!</p>
                                )}
                                </>
                            )}
                        </>
                    )}


                    {/* Seção de eventos pendentes*/}
                    {activeSection === 'locations' && (
                        <>
                            {isLoadingLocations ? (
                                <div className='spinner'></div>
                            ) : errorLocations ? (
                                <p className="error">{errorLocations}</p>
                            ) : (
                                <>
                                <div className={styles.Wrapper}>

                                    <div className= {styles.searchInputs}>
                                        <input type="text" placeholder="Pesquisar por local ..." value={searchLocalName} onChange={handleInputChangeLoc} className={'defaultInput ' + styles.inputField}/>
                                        
                                        <select value={searchStatusLocal} onChange={handleStatusLoc} className={styles.select + ' defaultselect'}>
                                          <option value="">Pesquisar por estado</option>
                                          <option value="Active">Active</option>
                                          <option value="Pending">Pending </option>
                                        </select>
                                    
                                    
                                        <select value={searchCatLocal} onChange={handleChangeCatLoc} className={styles.select + ' defaultselect'}>
                                            <option value="">Escolha uma categoria</option>
                                            <option value="Comida">Comida</option>
                                            <option value="Educação">Educação</option>
                                            <option value="Compras">Compras</option>
                                            <option value="Beleza">Beleza</option>
                                            <option value="Entretenimento">Entretenimento</option>
                                            <option value="Religião">Religião</option>
                                            <option value="MonumentosHistóricos">Monumentos históricos</option>
                                            <option value="Artes">Artes</option>
                                        </select>
                                    

                                    </div>
                                </div>

                                {filteredLocations.length !== 0 ? (
                                    <>
                                    <table className='defaultTable '>
                                        {/* Cabeçalho da tabela */}
                                        <thead>
                                            <tr>
                                                <th>Nome do Local</th>
                                                <th>Tipo</th>
                                                <th>Estado</th>
                                                <th>Username</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        {/* Corpo da tabela */}
                                        <tbody>
                                            {filteredLocations.map(loc => (
                                                <tr key={loc._id}>
                                                    <td>{loc.Name}</td>
                                                    <td>{loc.Type}</td>
                                                    <td>{loc.Status}</td>
                                                    <td>{loc.username}</td>
                                                    <td>
                                                        {/* Botões de ação */}
                                                        <button onClick={() => handleActionLocations(loc._id, 'accept')} className={styles.buttonAccept}>
                                                            <FontAwesomeIcon icon={faCheck} /> Aceitar
                                                        </button>
                                                        <button onClick={() => handleActionLocations(loc._id, 'pending')} className={styles.buttonPending}>
                                                            <FontAwesomeIcon icon={faSpinner} /> Pendente
                                                        </button>
                                                        <button onClick={() => localDelete(loc._id)} className={styles.buttonCancel}>
                                                            <FontAwesomeIcon icon={faTimes} /> Cancelar
                                                        </button>
                                                        <button onClick={() => navigate(`/locations/${loc._id}`)} className={styles.buttonInfo}>
                                                            <FontAwesomeIcon icon={faInfo} /> Detalhes
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </>
                                ) : (
                                    <p>Nenhum local encontrado!</p>
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
                            ) : errorUsers ? (
                                <p className="error">{errorUsers}</p>
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
