// rvents.js
import express from 'express';
import { Events, Users } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";

const router = express.Router();

//Busca todos os eventos e os ordena por BegDate
router.get('/displayAllEvents', async (request, response) => {
  try {
    // Consulta todos os eventos e os ordena por BegDate em ordem crescente
    const events = await Events.find({}).sort({ BegDate: 1 });

    return response.status(200).json({
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.log("Error fetching events:", error.message);
    response.status(500).json({ message: 'Internal server error! displyallevents' });
  }
});

router.get('/displayPendingEvents', async (request, response) => {
  try {
    // Consulta todos os eventos e os ordena por BegDate em ordem crescente
    const events = await Events.find({ Status: "Pending" }).sort({ BegDate: 1 });

    return response.status(200).json({
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.log("Error fetching events:", error.message);
    response.status(500).json({ message: 'Internal server error! displyallevents' });
  }
});



//Busca seletiva dos eventos apartir da data atual  
router.get('/SelectEvents', async (request, response) => {
  try {
    const currentDate = new Date();

    // Consulta eventos onde a data de início é maior ou igual à data atual e o status é "Active"
    const events = await Events.find({
      BegDate: { $gte: currentDate },
      Status: 'Active'
    })
      .select('BegDate Name Type EndDate Address Price Creator')
      .sort({ BegDate: 1 });

    return response.status(200).json({
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.log("Error fetching events:", error.message);
    response.status(500).json({ message: 'Internal server error! SelectEvents' });
  }
});


// Rota para buscar detalhes de um certo evento evento 
router.get('/:id', authPage, async (req, res) => {
  try {
    const eventId = req.params.id;
    let check = false;

    if (req.authenticated) {
      const userId = req.userid;

      // Buscar o evento pelo ID
      const event = await Events.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (event.InterestedUsers && event.InterestedUsers.includes(userId)) {
        check = true;
      }
      res.status(200).json({ event, check });
    } else {
      // Buscar o evento pelo ID
      const event = await Events.findById(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }  
      res.status(200).json({ event, check });
    }

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error! getid' });
  }
});

// Rota para criar um novo evento
router.post('/create', authPage, async (req, res) => {
  try {

    // Verifique se a autenticação foi bem-sucedida
    if (!req.authenticated) {
      // Trate o caso em que a autenticação falhou
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    // Extrair os dados do corpo da requisição
    const { eventType, eventName, eventBegDate,
      eventEndDate, eventDescription, eventAge,
      eventPrice, eventImage, eventAdress } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!eventType || !eventName || !eventBegDate || !eventEndDate || !eventDescription || !eventAge || !eventPrice || !eventAdress) {
      return res.status(400).json({ message: 'Fill all fields' });
    }

    // Verifica se eventAge e eventPrice são números
    if (isNaN(eventAge) || isNaN(eventPrice)) {
      return res.status(400).json({ message: 'Age and price must be numbers' });
    }

    // Verifica se a data de início é anterior à data de término
    if (new Date(eventBegDate) > new Date(eventEndDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    // Obter as informações do usuário autenticado
    const userid = req.userid;
    // Aqui você pode buscar mais informações do usuário no banco de dados usando o _id
    const user = await Users.findById(userid).select("username AdminPermission");

    let newEvent;   

    if (user.AdminPermission){    
      // Criar um novo evento
      newEvent = new Events({
        Type: eventType,
        Name: eventName,
        BegDate: eventBegDate,
        EndDate: eventEndDate,
        Description: eventDescription,
        AgeRecomendation: eventAge,
        Creator: user.username,
        InterestedUsers: [],
        Image: eventImage,
        Address: eventAdress,
        Price: eventPrice,
        Status: "Active"
      })
    }else{
      // Criar um novo evento
      newEvent = new Events({
        Type: eventType,
        Name: eventName,
        BegDate: eventBegDate,
        EndDate: eventEndDate,
        Description: eventDescription,
        AgeRecomendation: eventAge,
        Creator: user.username,
        InterestedUsers: [],
        Image: eventImage,
        Address: eventAdress,
        Price: eventPrice,
        Status: "Pending"
      })
    }
    // Salvar o evento no banco de dados
    await newEvent.save();
  
    // Adicionar o ID do evento ao campo EventCreator do usuário
    await Users.findByIdAndUpdate(user._id, { $push: { EventCreator: newEvent._id } }, { new: true });

    // Responder com sucesso
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
    
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error! create events' });
  }
});

// Rota para o usuário dar follow em um evento
router.put('/:eventId/interested', authPage, async (req, res) => {
  try {
    // Verifique se a autenticação foi bem-sucedida
    if (!req.authenticated) {
      // Trate o caso em que a autenticação falhou
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    const eventId = req.params.eventId;
    const userId = req.userid;
    let check;

    // Encontre o evento pelo ID e selecione apenas o array de InterestedUsers
    const event = await Events.findById(eventId).select("InterestedUsers");

    // Verifique se o evento existe e se o userId já está na lista de InterestedUsers
    if (event && event.InterestedUsers.indexOf(userId) !== -1) {
      // Remova o ID do usuário da lista de usuários interessados no evento
      await Events.findByIdAndUpdate(eventId, { $pull: { InterestedUsers: userId } });
      check = false;
    } else {
      // Adicione o ID do usuário à lista de usuários interessados no evento
      await Events.findByIdAndUpdate(eventId, { $addToSet: { InterestedUsers: userId } });
      check = true;
    }

    // Recupere a lista atualizada de interessados após a modificação
    const updatedEvent = await Events.findById(eventId).select("InterestedUsers");
    const updatedCount = updatedEvent ? updatedEvent.InterestedUsers.length : 0;


    res.status(200).json({ message: 'Liked event successfully', count: updatedCount, check });
  } catch (error) {
    console.error('Error liking event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete("/eventDelet", authPage, async (req, res) => {
  try {
      // Verifique se a autenticação foi bem-sucedida
      if (!req.authenticated) {
          // Trate o caso em que a autenticação falhou
          return res.status(401).json({ message: 'Unauthorized: authentication failed' });
      }

      const userId = req.userid;
      const eventId = req.body.eventId;
      
      // Encontre o usuário pelo ID
      const user = await Users.findById(userId);
      
      // Verifique se o usuário é o criador do evento
      if (!user || !user.EventCreator || !user.EventCreator.includes(eventId)) {
          return res.status(403).json({ message: 'Forbidden: you are not the creator of this event' });
      }

      await Users.findByIdAndUpdate(userId, { $pull: { EventCreator: eventId } });

      // Se o usuário for o criador do evento, exclua o evento
      await Events.findByIdAndDelete(eventId);

      res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Internal server error! eventDelet' });
  }
});


export default router;