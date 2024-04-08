// rvents.js
import express from 'express';
import { Events, Users } from "../mongo/esquemas.js";
import { isAuthenticated } from './rusers.js';

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
    response.status(500).json({  message: 'Internal server error! displyallevents' });
  }
});


//Busca seletiva dos eventos apartir da data atual  
router.get('/SelectEvents', async (request, response) => {
  try {
    const currentDate = new Date();

    // Consulta eventos onde a data de início é maior ou igual à data atual
    const events = await Events.find({ BegDate: { $gte: currentDate } })
                                .select('BegDate Name Type EndDate Address Price Creator')
                                .sort({ BegDate: 1 });

    return response.status(200).json({
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.log("Error fetching events:", error.message);
    response.status(500).json({  message: 'Internal server error! SelectEvents' });
  }
});


// Rota para criar um novo evento
router.post('/create', async (req, res) => {
  try {
    // Extrair os dados do corpo da requisição
    const { eventType, eventName, eventBegDate,
      eventEndDate, eventDescription, eventAge, username,
      eventInterestedUsers, eventPrice, eventImage, eventAdress } = req.body;

    // Verificar se o usuário existe
    let existingUser = await Users.findOne({ username });
    
    if (!existingUser) {
      return res.status(400).json({ message: 'This username does not exist!' });
    }

    // Criar um novo evento
    const newEvent = new Events({
      Type: eventType,
      Name: eventName,
      BegDate: eventBegDate,
      EndDate: eventEndDate,
      Description: eventDescription,
      AgeRecomendation: eventAge,
      Creator: username,
      InterestedUsers: eventInterestedUsers,
      Image: eventImage,
      Address: eventAdress,
      Price: eventPrice
    })

    // Salvar o evento no banco de dados
    await newEvent.save();

    // Adicionar o ID do evento ao campo EventCreator do usuário
    existingUser = await Users.findByIdAndUpdate(existingUser._id, { $push: { EventCreator: newEvent._id } }, { new: true });

    // Responder com sucesso
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error! createevents' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const eventId = req.params.id;

    // Buscar o evento pelo ID
    const event = await Events.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Retornar as informações do evento
    res.status(200).json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error! getid' });
  }
});

// Rota para o usuário dar "like" em um evento
router.put('/:eventId/like', isAuthenticated, async (req, res) => {
  try {
      const eventId  = req.params;

      // Adicione o ID do usuário à lista de usuários interessados no evento
      await Event.findByIdAndUpdate(eventId, { $addToSet: { InterestedUsers: userId } });

      res.status(200).json({ message: 'Liked event successfully' });
  } catch (error) {
      console.error('Error liking event:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Rota para o usuário remover o "like" de um evento
router.put('/:eventId/unlike', isAuthenticated, async (req, res) => {
  try {
      const eventId = req.params;

      // Remova o ID do usuário da lista de usuários interessados no evento
      await Event.findByIdAndUpdate(eventId, { $pull: { InterestedUsers: userId } });

      res.status(200).json({ message: 'Unliked event successfully' });
  } catch (error) {
      console.error('Error unliking event:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;