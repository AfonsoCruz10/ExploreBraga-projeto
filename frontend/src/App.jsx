import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import About from './pages/About/About.jsx'
import Log_In from './pages/Log/Log_In.jsx'
import Events from './pages/Events/Events.jsx'
import Locations from './pages/Locations/Locations.jsx'
import SignUpForm from './pages/SignUp/SignUpForm.jsx'
import EventDetails from './pages/EventDetails/EventDetails.jsx'

/*
O componente principal que configura as rotas da aplicação utilizando React Router.
 */
function App() {
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
                    <Route path="/login" element={<Log_In />} />
                    {/* Rota para a página de signup */}
                    <Route path="/signup" element={<SignUpForm />} />
                    {/* Rota para a página de eventos */}
                    <Route path="/events" element={<Events />} />
                    {/* Rota para a página de locais */}
                    <Route path="/locations" element={<Locations />} />
                    {/* Rota para a página eventos detalhados */}
                    <Route path="/events/:eventId" element={<EventDetails />} />

                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App