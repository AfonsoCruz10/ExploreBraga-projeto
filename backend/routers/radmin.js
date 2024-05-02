//radmin.js
import express from 'express';
import { Users, Events, Locations } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();

//Rota para visualizar todos os utilizadores
router.get('/displayAllUsers' ,authPage , async (req, res) => {
    try {
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }
        const userid = req.userid; 

        // Encontra todos os usuários, excluindo o usuário autenticado
        const users = await Users.find({ _id: { $ne: userid } }, '-HashedPassword');

        return res.status(200).json({ data: users });
    } catch (error) {
        console.log("Error fetching users:", error.message);
        res.status(500).json({ message: 'Internal server error! displayuser' });
    }
});

// Rota para obter todos os eventos
router.get('/events' ,authPage ,async (req, res) => {
    try {
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }
        const currentDate = new Date();

        const events = await Events.find({ BegDate: { $gte: currentDate } }).sort({ BegDate: 1 });

        if (!events) {
            return res.status(404).json({ message: 'Events not found' });
        }

        const usernamePromises = events.map(async (event) => {
            const user = await Users.findById(event.Creator).select('username');
            const showEvents ={
               ...event.toObject(),
                username: user.username 
            }

            return showEvents;
        });

        const finalEvents = await Promise.all(usernamePromises);

        return res.status(200).json({ data: finalEvents });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
    }
});


// Rota para obter todos os eventos pendentes
router.get('/events/pending',authPage ,async (req, res) => {
    try {
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }

        const pendingEvents = await Events.find({ Status: 'Pending' }).sort({ BegDate: 1 });

        if (!pendingEvents) {
            return res.status(404).json({ message: 'Peding events not found' });
        }

        res.status(200).json({ data: pendingEvents });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar eventos pendentes', error: error.message });
    }
});

// Rota para obter todos os eventos activos
router.get('/events/active',authPage ,async (req, res) => {
    try {
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }

        const ActiveEvents = await Events.find({ Status: 'Active' }).sort({ BegDate: 1 });

        if (!ActiveEvents) {
            return res.status(404).json({ message: 'Peding events not found' });
        }

        res.status(200).json({ data: ActiveEvents });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar eventos pendentes', error: error.message });
    }
});

// Rota para realizar uma ação em um evento (aceitar ou cancelar)
router.put('/events/:eventId/:action',authPage ,async (req, res) => {

    const { eventId, action } = req.params;

    try {
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }
        // Verifique se a ação é válida (aceitar ou cancelar)
        if (action !== 'accept' && action !== 'cancel' && action !== 'pending' ) {
            return res.status(400).json({ message:'Ação inválida'});
        }

        // Encontre o evento pelo ID fornecido
        const event = await Events.findById(eventId);

        // Verifique se o evento existe
        if (!event) {
            return res.status(400).json({ message:'Evento não encontrado'});
        }

        if(action === 'accept'){
            event.Status = 'Active'
        }else if(action === 'cancel'){
            event.Status = 'Canceled'
        }else{
            event.Status = 'Pending'
        }

        // Salve as alterações no banco de dados
        await event.save();

        res.status(200).json({ message: `Estado do evento mudado com sucesso` });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar ação no evento', error: error.message });
    }
});



export default router;
