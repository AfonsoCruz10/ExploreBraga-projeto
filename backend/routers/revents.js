// rvents.js
import express from 'express';
import { Events, Users, Locations } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";
import mongoose from 'mongoose';

const router = express.Router();

//Busca todos os eventos e os ordena por BegDate
router.get('/displayAllEvents', async (request, response) => {
  try {
    // Consulta todos os eventos e os ordena por BegDate em ordem crescente
    const events = await Events.find({}).sort({ BegDate: 1 });

    if (!events) {
      return res.status(404).json({ message: 'Events not found' });
    }

    return response.status(200).json({
      data: events
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

    // Agregação para buscar eventos com data de início >= data atual e status "Active"
    const events = await Events.aggregate([
      { $match: { EndDate: { $gte: currentDate }, Status: 'Active' } },
      {
        $lookup: {
          from: 'Users',
          localField: 'Creator',
          foreignField: '_id',
          as: 'creatorInfo'
        }
      },
      { $unwind: '$creatorInfo' },
      {
        $project: {
          BegDate: 1,
          Name: 1,
          Type: 1,
          EndDate: 1,
          Address: 1,
          Price: 1,
          Creator: 1,
          username: '$creatorInfo.username'
        }
      },
      { $sort: { BegDate: 1 } }
    ]);

    return response.status(200).json({
      data: events
    });

  } catch (error) {
    console.error("Error fetching events:", error.message);
    response.status(500).json({ message: 'Internal server error! SelectEvents' });
  }
});

// Rota para criar um novo evento
router.post('/create', authPage, async (req, res) => {
  try {
    // Verifica se a autenticação foi bem-sucedida
    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    const { eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAge, eventPrice, eventImage, eventAddress, eventLocAssoc } = req.body;

    // Verifica se todos os campos estão preenchidos
    const requiredFields = [eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAddress];
    if (requiredFields.some(field => !field)) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    // Verifica se eventAge e eventPrice são números
    if ((isNaN(eventAge) && eventAge < 0) || (isNaN(eventPrice) && eventPrice < 0)) {
      return res.status(400).json({ message: 'Idade e preço devem ser números' });
    }

    // Verifica se a data de início é anterior à data de término
    if (new Date(eventBegDate) > new Date(eventEndDate)) {
      return res.status(400).json({ message: 'A data de início deve ser anterior à data de término' });
    }

    // Obter as informações do usuário autenticado
    const user = await Users.findById(req.userid).select("username AdminPermission");

    // Status do evento
    const status = user.AdminPermission ? "Active" : "Pending";

    // Criar um novo evento
    const newEvent = new Events({
      Type: eventType,
      Name: eventName,
      BegDate: eventBegDate,
      EndDate: eventEndDate,
      Description: eventDescription,
      AgeRecomendation: eventAge,
      Creator: req.userid,
      InterestedUsers: [],
      Image: eventImage,
      Address: eventAddress,
      Price: eventPrice,
      Status: status,
      LocAssoc: eventLocAssoc
    });

    // Salvar o evento no banco de dados
    await newEvent.save();

    if (eventLocAssoc) {
      const location = await Locations.findById(eventLocAssoc);
      if (location) {
        location.LocEvents.push(newEvent._id);
        await location.save();
        newEvent.LocAssoc = eventLocAssoc;
        await newEvent.save();
      } else {
        return res.status(404).json({ message: 'Location not found' });
      }
    }


    // Adicionar o ID do evento ao campo EventCreator do usuário
    await Users.findByIdAndUpdate(req.userid, { $push: { EventCreator: newEvent._id } }, { new: true });

    // Responder com sucesso
    res.status(201).json();
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error! create events' });
  }
});

router.delete("/eventDelet", authPage, async (req, res) => {
  try {
    // Verifique se a autenticação foi bem-sucedida
    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    const userId = req.userid;
    const eventId = req.body.eventId;

    // Encontre o usuário pelo ID
    const user = await Users.findById(userId).select("EventCreator");

    // Verifique se o usuário é o criador do evento
    if (!user || !user.EventCreator || !user.EventCreator.includes(eventId)) {
      return res.status(403).json({ message: 'Forbidden: you are not the creator of this event' });
    }

    await Users.findByIdAndUpdate(userId, { $pull: { EventCreator: eventId } });
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

// Rota para atualizar os detalhes de um evento
router.put('/edit/:eventId', authPage, async (req, res) => {
  try {
    // Verificar se o usuário está autenticado e é o criador do evento
    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }
    const eventId = req.params.eventId;
    const { eventType, eventName, eventBegDate, eventEndDate, eventDescription, eventAge, eventPrice, eventImage, eventAddress, eventLocAssoc } = req.body;


    // Verifica se todos os campos estão preenchidos
    if (!eventType || !eventName || !eventBegDate || !eventEndDate || !eventDescription || !eventAddress) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    // Verifica se eventAge e eventPrice são números
    if ((isNaN(eventAge) && eventAge < 0) || (isNaN(eventPrice) && eventPrice < 0)) {
      return res.status(400).json({ message: 'Idade e preço devem ser números' });
    }

    // Verifica se a data de início é anterior à data de término
    if (new Date(eventBegDate) > new Date(eventEndDate)) {
      return res.status(400).json({ message: 'A data de início deve ser anterior à data de término' });
    }

    // Buscar o evento pelo ID
    const event = await Events.findById(eventId);

    // Verificar se o evento existe
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verificar se o usuário autenticado é o criador do evento
    if (event.Creator.toString() !== req.userid.toString()) {
      return res.status(403).json({ message: 'Forbidden: you are not the creator of this event' });
    }

    // Atualizar os detalhes do evento com os novos valores
    event.Type = eventType;
    event.Name = eventName;
    event.BegDate = eventBegDate;
    event.EndDate = eventEndDate;
    event.Description = eventDescription;
    event.AgeRecomendation = eventAge;
    event.Price = eventPrice;
    event.Image = eventImage;
    event.Address = eventAddress;

    // Se eventLocAssoc não estiver vazio, associar o evento ao local
    if (eventLocAssoc) {
      const local = await Locations.findById(eventLocAssoc);
      if (local) {
        // Verificar se o evento já não está associado ao local
        if (!local.LocEvents.includes(event._id)) {
          local.LocEvents.push(new mongoose.Types.ObjectId(event._id));
          await local.save();
        }
        event.LocAssoc = eventLocAssoc;
      } else {
        return res.status(404).json({ message: 'Local not found' });
      }
    } else {
      event.LocAssoc = null;
    }

    // Ao atualizar o evento status muda se não fores admin
    if (!req.admin) {
      event.Status = "Pending";
    }

    // Salvar as alterações no banco de dados
    await event.save();

    // Responder com uma mensagem de sucesso
    res.status(200).json();

  } catch (error) {
    console.error('Error updating event details:', error);
    res.status(500).json({ message: 'Internal server error! editid' });
  }
});

// Rota para o usuário dar follow em um evento
router.put('/interested/:eventId', authPage, async (req, res) => {
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

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verifique se o evento existe e se o userId já está na lista de InterestedUsers
    if (event.InterestedUsers.indexOf(userId) !== -1) {
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


    res.status(200).json({ count: updatedCount, check });
  } catch (error) {
    console.error('Error liking event:', error);
    res.status(500).json({ message: 'Internal server error interested' });
  }
});

// Rota para buscar eventos criados pelo usuário autenticado
router.get('/buscarLocaisEvents', authPage, async (req, res) => {
  try {
    const userId = req.userid;
    // Buscar locais criados pelo usuário autenticado
    const userLocations = await Locations.find({ Creator: userId }).select("Name");

    res.status(200).json({ locations: userLocations });
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ message: 'Internal server error! locaisEvents' });
  }
});

// Rota para buscar detalhes de um certo evento evento 
router.get('/:eventId', authPage, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.userid;
    let check = false;

    // Buscar o evento pelo ID e popular o campo Creator com username e ProfileImage
    const event = await Events.findById(eventId)
      .select("Type Name BegDate EndDate Description AgeRecomendation Creator InterestedUsers Image Address Price")
      .populate('Creator', 'username ProfileImage');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verificar se o usuário autenticado está interessado no evento
    if (req.authenticated && event.InterestedUsers.includes(userId)) {
      check = true;
    }

    // Estrutura para o retorno do evento com os dados do criador
    const showEvent = {
      ...event.toObject(),
      username: event.Creator.username,
      ProfileImage: event.Creator.ProfileImage
    };

    res.status(200).json({ event: showEvent, check });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error! getidteste' });
  }
});

export default router;