// rlocations.js
import express from 'express';
import { Locations, Users, Events } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";
import editLocationsRouter from "./rLocRevies.js";
import mongoose from 'mongoose';

const router = express.Router();

router.use('/reviews', editLocationsRouter);

// Rota para visualizar todos os locais
router.get('/seebycategories', async (req, res) => {
  try {
    const loc = await Locations.find({ Status: "Active" }).select('_id Type Name Image Address');

    const finalLoc = loc.map(location => ({
      _id: location._id,
      Type: location.Type,
      Name: location.Name,
      Address: location.Address,
      Image: location.Image[0]
    }));

    return res.status(200).json({
      data: finalLoc
    });

  } catch (error) {
    console.log("Error fetching locations:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo local
router.post('/create', authPage, async (req, res) => {
  try {

    // Verifique se a autenticação foi bem-sucedida
    if (!req.authenticated) {
      // Trate o caso em que a autenticação falhou
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    // Extrair os dados do corpo da requisição
    const { locationType, locationName, locationDescription, locationAge,
      locationImage, locationAdress } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!locationType || !locationName || !locationDescription || !locationAdress) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    if (isNaN(locationAge) && locationAge < 0) {
      return res.status(400).json({ message: 'A idade deve ser números' });
    }

    // Obter as informações do usuário autenticado
    const userid = req.userid;
    // Aqui você pode buscar mais informações do usuário no banco de dados usando o _id
    const user = await Users.findById(userid).select("username AdminPermission");

    const status = user.AdminPermission ? "Active" : "Pending";

    // Criar um novo evento
    const newLocation = new Locations({
      Type: locationType,
      Name: locationName,
      Description: locationDescription,
      AgeRecomendation: locationAge,
      Creator: userid,
      Reviews: [],
      Image: locationImage,
      Address: locationAdress,
      Status: status,
      LocEvents: []
    })

    // Salvar o evento no banco de dados
    await newLocation.save();

    await Users.findByIdAndUpdate(req.userid, { $push: { LocalCreator: newLocation._id } }, { new: true });

    // Responder com sucesso
    res.status(201).json();

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error! create events' });
  }
});

// Rota para atualizar os detalhes de um local
router.get('/infoToEdit/:localId', authPage, async (req, res) => {
  try {
    // Verificar se o usuário está autenticado e é o criador do local
    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed in infoToEdit' });
    }

    const localId = req.params.localId;
    const local = await Locations.findById(localId).select(" Type Name Description AgeRecomendation Creator Image Address ");

    if (!local) {
      return res.status(404).json({ message: 'Local not found' });
    }

    // Verificar se o usuário autenticado é o criador do local
    if (local.Creator.toString() !== req.userid.toString()) {
      return res.status(403).json({ message: 'Forbidden: you are not the creator of this location' });
    }

    // Responder com uma mensagem de sucesso
    res.status(200).json({ local });

  } catch (error) {
    console.error('Error updating location details:', error);
    res.status(500).json({ message: 'Internal server error in infoToEdit' });
  }
});


// Rota para atualizar os detalhes de um local
router.put('/edit/:localId', authPage, async (req, res) => {
  try {
    // Verificar se o usuário está autenticado e é o criador do local
    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }
    const localId = req.params.localId;
    const { locationType, locationName, locationDescription, locationAge, locationImage, locationAddress } = req.body;

    // Verifica se todos os campos estão preenchidos
    if (!locationType || !locationName || !locationDescription || !locationAddress) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    // Verifica se locationAge é um número
    if (isNaN(locationAge) && locationAge < 0) {
      return res.status(400).json({ message: 'A idade deve ser números' });
    }

    // Buscar o local pelo ID
    const local = await Locations.findById(localId).select(" Type Name Description AgeRecomendation Status Creator Image Address ");

    // Verificar se o local existe
    if (!local) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Verificar se o usuário autenticado é o criador do local
    if (local.Creator.toString() !== req.userid.toString()) {
      return res.status(403).json({ message: 'Forbidden: you are not the creator of this location' });
    }

    // Atualizar os detalhes do local com os novos valores
    local.Type = locationType;
    local.Name = locationName;
    local.Description = locationDescription;
    local.AgeRecomendation = locationAge;
    local.Image = locationImage;
    local.Address = locationAddress;

    // Ao atualizar o local status muda se não fores admin
    if (!req.admin) {
      local.Status = "Pending";
    }

    // Salvar as alterações no banco de dados
    await local.save();

    // Responder com uma mensagem de sucesso
    res.status(200).json();

  } catch (error) {
    console.error('Error updating location details:', error);
    res.status(500).json({ message: 'Internal server error in edit' });
  }
});

router.delete("/locationDelete", authPage, async (req, res) => {
  try {
    // Verifique se a autenticação foi bem-sucedida
    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    const userId = req.userid;
    const localId = req.body.localId;

    // Encontre o usuário pelo ID
    const user = await Users.findById(userId);

    // Verifique se o usuário é o criador do local
    if (!user || !user.LocalCreator || !user.LocalCreator.includes(localId)) {
      return res.status(403).json({ message: 'Forbidden: you are not the creator of this location' });
    }

    // Atualiza o usuário removendo o local da lista LocalCreator
    await Users.findByIdAndUpdate(userId, { $pull: { LocalCreator: localId } });

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
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Internal server error! locationDelete' });
  }
});

router.put('/addToFavorites/:locationId', authPage, async (req, res) => {
  try {

    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    const locationId = req.params.locationId;
    const userId = req.userid;
    let check;

    // Use a operação atômica do MongoDB para adicionar ou remover o local da lista de favoritos
    const user = await Users.findById(userId).select("LocalFavorites");

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let message;
    if (user.LocalFavorites.indexOf(locationId) !== -1) {
      // remover da lista
      await Users.findByIdAndUpdate(userId, { $pull: { LocalFavorites: locationId } });
      message = 'Local removido dos favoritos';
      check = false;
    } else {
      // Adicionar o local à lista do utilizador
      await Users.findByIdAndUpdate(userId, { $addToSet: { LocalFavorites: locationId } });
      message = 'Local adicionado aos favoritos';
      check = true;
    }

    res.status(200).json({ message, check });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Internal server error while adding to favorites.' });
  }
});

// Rota para buscar eventos associados a um local específico
router.get('/assocEvents/:localId', async (req, res) => {
  try {
    const localId = req.params.localId; // Extrai o ID do local da URL
    const currentDate = new Date(); // Obtém a data atual

    // Verifica se o localId é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(localId)) {
      return res.status(400).json({ message: 'Formato de ID inválido' });
    }

    // Busca o local pelo ID e popula os eventos associados
    const local = await Locations.findById(localId).select("LocEvents").populate({
      path: 'LocEvents',
      match: { BegDate: { $gte: currentDate }, Status: 'Active' }, // Filtra eventos que começam na data atual ou depois e estão ativos
      options: { sort: { BegDate: 1 } } // Ordena os eventos por data de início em ordem crescente
    }).lean();

    if (!local) {
      return res.status(404).json({ message: 'Local não encontrado' }); // Retorna erro se o local não for encontrado
    }

    const events = local.LocEvents; // Obtém os eventos filtrados e ordenados do local

    // Se não houver eventos, retorna um array vazio
    if (events.length === 0) {
      return res.status(200).json({ events: [] });
    }

    // Cria uma lista de IDs dos eventos para enriquecer com informações adicionais dos criadores dos eventos
    const eventIds = events.map(event => event._id);
    const enrichedEvents = await Events.aggregate([
      { $match: { _id: { $in: eventIds } } }, // Filtra os eventos pelos IDs
      {
        $lookup: {
          from: 'Users', // Realiza a junção com a coleção de usuários
          localField: 'Creator',
          foreignField: '_id',
          as: 'creatorInfo'
        }
      },
      { $unwind: '$creatorInfo' }, // Desaninha a matriz creatorInfo para facilitar o acesso
      {
        $project: {
          BegDate: 1, // Inclui a data de início
          Name: 1, // Inclui o nome do evento
          Type: 1, // Inclui o tipo do evento
          EndDate: 1, // Inclui a data de término
          Address: 1, // Inclui o endereço do evento
          Price: 1, // Inclui o preço do evento
          Creator: 1, // Inclui o ID do criador do evento
          username: '$creatorInfo.username' // Inclui o nome de usuário do criador do evento
        }
      }
    ]);

    res.status(200).json({ events: enrichedEvents }); // Retorna a lista de eventos enriquecidos
  } catch (error) {
    console.error('Erro ao buscar eventos associados:', error); // Loga o erro no console
    res.status(500).json({ message: 'Erro interno do servidor' }); // Retorna um erro de servidor interno
  }
});

// Rota para buscar um local pelo ID
router.get('/:localId', authPage, async (req, res) => {
  try {
    const localId = req.params.localId;
    let check = false;

    if (req.authenticated) {
      const userId = req.userid;
      const user = await Users.findById(userId).select('LocalFavorites');
      if (user.LocalFavorites && user.LocalFavorites.includes(localId)) {
        check = true;
      }
    }
    // Verifica se o localId é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(localId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const local = await Locations.findById(localId)
      .select("Type Name Description AgeRecomendation Creator Image Address")
      .populate('Creator', 'username ProfileImage')
      .populate('Reviews.RevUserId', 'username');

    if (!local) {
      return res.status(404).json({ message: 'Local not found id' });
    }

    res.status(200).json({ local, check });

  } catch (error) {
    console.error('Error fetching local:', error);
    res.status(500).json({ message: 'Internal server error! getid' });
  }
});

export default router;