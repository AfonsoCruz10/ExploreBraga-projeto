// rvents.js
import express from 'express';
import { Events, Users } from "../mongo/esquemas.js";

const router = express.Router();

//Busca todos os eventos apartir da data atual  
router.get('/displayAllEvents', async (request, response) => {
  try {
    const currentDate = new Date();

    // Consulta eventos onde a data de início é maior ou igual à data atual
    const events = await Events.find({ BegDate: { $gte: currentDate } });

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
                                .select('BegDate Name Type EndDate Address Price Creator');

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

export default router;