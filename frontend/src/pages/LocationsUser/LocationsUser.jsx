import React, { useEffect } from 'react';
import Header from "../../components/Header/Header.jsx";
import { useUserLocations } from '../../hooks/useLocationsUser.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from "./LocationsUser.module.css";
import { useNavigate } from 'react-router-dom';
import Footer from "../../components/Footer/Footer.jsx";


function UserLocations() {
    const { userLocationsConnect, localDelete, userLocations, isLoading, error } = useUserLocations();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await userLocationsConnect();
            } catch (error) {
                console.error('Error fetching user locations:', error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (localId) => {
        try {
            await localDelete(localId);
        } catch (error) {
            console.error('Error delete Locations:', error);
        }
    };


    //const sortedLocations = userLocations.slice().sort((a, b) => new Date(a.BegDate) - new Date(b.BegDate));

    return (
        <>
            <Header />
            <div className="body">
                <h2 className="titulo">Meus Locais</h2>
                <div className={"defaultContainer " + styles.userEventsContainer}>
                    {isLoading ? (
                        <div className='spinner'></div>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : userLocations.length !== 0 ? (
                        <table className='defaultTable '>
                            <thead>
                                <tr>
                                    <th>Nome do Evento</th>
                                    <th>Tipo</th>
                                    <th>Endereço</th>
                                    <th>Estado</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userLocations.map(local => (
                                    <tr key={local._id}>
                                        <td>{local.Name}</td>
                                        <td>{local.Type}</td>
                                        <td>{local.Address}</td>
                                        <td>{local.Status}</td>
                                        <td>
                                            <button onClick={() => navigate(`/locations/edit/${local._id}`)} className={styles.buttonEdit}>
                                                <FontAwesomeIcon icon={faEdit} /> Editar
                                            </button>
                                            <button onClick={() => handleDelete(local._id)} className={styles.buttonDelete}>
                                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum local encontrado!</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UserLocations;
