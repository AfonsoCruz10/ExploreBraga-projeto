import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import About from './pages/About/About.jsx'
import Log_In from './pages/Log/Log_In.jsx'
import Events from './pages/Events/Events.jsx'
import Locations from './pages/Locations/Locations.jsx'
import SignUpForm from './pages/SignUp/SignUpForm.jsx'
import EventDetails from './pages/EventDetails/EventDetails.jsx'
import UserAccount from './pages/UserAccount/UserAccount.jsx'
import CreateEvent from './pages/CreatEvent/CreatEvent.jsx'
import EventsUser from './pages/EventsUser/EventsUser.jsx'
import { useAuthContext } from './hooks/useAuthContext.jsx';

function App() {
    const { user } = useAuthContext();

    // Renderiza o componente principal da aplicação
    return (
        <>
            {/* Configura o roteamento usando BrowserRouter */}
            <BrowserRouter>
                {/* Define as rotas da aplicação */}
                <Routes>
                    {/* Rota inicial (página inicial) */}
                    <Route index element={<Home />} />
                    {/* Rota para a página inicial */}
                    <Route path="/home" element={<Home />} />
                    {/* Rota para a página "About Us" */}
                    <Route path="/about" element={<About />} />
                    {/* Rota para a página de login */}
                    <Route path="/login" element={ !user ? <Log_In /> : <Navigate to="/useraccount" />} />
                    {/* Rota para a página de signup */}
                    <Route path="/signup" element={ !user ? <SignUpForm />  : <Navigate to="/login" /> } />
                    {/* Rota para a página de eventos */}
                    <Route path="/events" element={<Events />} />
                    {/* Rota para a página de locais */}
                    <Route path="/locations" element={<Locations />} />
                    {/* Rota para a página eventos detalhados */}
                    <Route path="/events/:eventId" element={<EventDetails />} />
                    {/* Rota para a página de conta do usuário */}
                    <Route path="/useraccount" element= { user ? <UserAccount /> : <Navigate to="/login" /> } />
                    {/* Rota para a página de criar eventos */}
                    <Route path="/userCreatEvent" element= { user ? <CreateEvent /> : <Navigate to="/login" /> } />

                    <Route path="/userEvents" element= { user ? <EventsUser /> : <Navigate to="/login" /> } />

                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
