//radmin.js
import express from 'express';
import { Users, Events, Locations } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";
import dotenv from 'dotenv';

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
        const users = await Users.find({ _id: { $ne: userid } }, '-HashedPassword').select(" username email birthDate ProfileImage");

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

        const events = await Events.find({ EndDate: { $gte: currentDate } }).select(" Type Name BegDate EndDate Creator Status").sort({ BegDate: 1 });

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


// Rota para obter todos os eventos
router.get('/locations' ,authPage ,async (req, res) => {
    try {
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }

        const locations = await Locations.find({ }).select(" Type Name Creator Status").sort({ BegDate: 1 });

        if (!locations) {
            return res.status(404).json({ message: 'Events not found' });
        }

        const usernamePromises = locations.map(async (loc) => {
            const user = await Users.findById(loc.Creator).select('username');
            const showLocations ={
               ...loc.toObject(),
                username: user.username 
            }

            return showLocations;
        });

        const finalLocations = await Promise.all(usernamePromises);

        return res.status(200).json({ data: finalLocations });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar eventos', error: error.message });
    }
});

// Rota para realizar uma ação em um evento (aceitar ou cancelar)
router.put('/eventAction/:eventId/:action',authPage ,async (req, res) => {

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
        const event = await Events.findById(eventId).select("Status");

        // Verifique se o evento existe
        if (!event) {
            return res.status(400).json({ message:'Evento não encontrado'});
        }

        if(action === 'accept'){
            event.Status = 'Active'
        }else {
            event.Status = 'Pending'
        }

        // Salve as alterações no banco de dados
        await event.save();

        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar ação no evento', error: error.message });
    }
});

// Rota para realizar uma ação em um evento (aceitar ou cancelar)
router.put('/locationAction/:localId/:action',authPage ,async (req, res) => {

    const { localId, action } = req.params;

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
        const loc = await Locations.findById(localId).select("Status");

        // Verifique se o evento existe
        if (!loc) {
            return res.status(400).json({ message:'Evento não encontrado'});
        }

        if(action === 'accept'){
            loc.Status = 'Active'
        } else{
            loc.Status = 'Pending'
        }

        // Salve as alterações no banco de dados
        await loc.save();

        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: 'Erro ao realizar ação no evento', error: error.message });
    }
});

router.delete("/eventDelet", authPage, async (req, res) => {
    try {
        // Verifique se a autenticação foi bem-sucedida
        if (!req.authenticated) {
            return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }
        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }

        const eventId = req.body.eventId;
        
        // Encontre o evento pelo ID
        const event = await Events.findById(eventId).select("Creator");

        // Verifique se o evento existe
        if (!event) {
          return res.status(404).json({ message: 'Event not found' });
        }
  
        await Users.findByIdAndUpdate(event.Creator, { $pull: { EventCreator: eventId } });
        await Locations.updateOne(
          { LocEvents: eventId },
          { $pull: { LocEvents: eventId } }
        );
  
        // Se o usuário for o criador do evento, exclua o evento
        await Events.findByIdAndDelete(eventId);
  
        res.status(200).json();
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal server error! eventDelet' });
    }
});

router.delete("/locationDelete", authPage, async (req, res) => {
    try {
        // Verifique se a autenticação foi bem-sucedida
        if (!req.authenticated) {
        return res.status(401).json({ message: 'Unauthorized: authentication failed' });
        }

        if (!req.admin) {
            return res.status(401).json({ message: 'Unauthorized: must be admin' });
        }

        const localId = req.body.localId;

        // Encontre o usuário pelo ID
        const loc = await Locations.findById(localId).select("Creator");
        
        if (!loc) {
          return res.status(404).json({ message: 'Local not found' });
        }
        // Atualiza o usuário removendo o local da lista LocalCreator
        await Users.findByIdAndUpdate(loc.Creator, { $pull: { LocalCreator: localId } });

        // Para cada evento associado ao local, remova o local da lista LocAssoc
        const events = await Events.find({ LocAssoc: localId });
        for (const event of events) {
            // Remova o local associado ao evento
            event.LocAssoc = null;
            await event.save();
        }
    
        // Se o usuário for o criador do local, exclua o local
        await Locations.findByIdAndDelete(localId);
    
        // Remova o local dos favoritos de todos os usuários
        await Users.updateMany({ LocalFavorites: localId }, { $pull: { LocalFavorites: localId } });
    
        res.status(200).json();
    } catch (error) {
        console.error('Error deleting local:', error);
        res.status(500).json({ message: 'Internal server error! locationDelete' });
    }
});



export default router;
