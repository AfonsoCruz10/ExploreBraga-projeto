// rlocations.js
import express from 'express';
import { Locations, Users } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";

const router = express.Router();

router.get('/seebycategories', async (req, res) => {
  try {
    const loc = await Locations.find({ Status: "Active" });

    const usernamePromises = loc.map(async (event) => {
      const user = await Users.findById(event.Creator).select('username');
      const showLocations = {
        ...event.toObject(),
        username: user.username
      }

      return showLocations;
    });

    const finalLocatios = await Promise.all(usernamePromises);


    return res.status(200).json({
      count: finalLocatios.length,
      data: finalLocatios,
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
    if (!locationType || !locationName || !locationDescription || !locationAge || !locationAdress) {
      return res.status(400).json({ message: 'Fill all fields' });
    }

    if (isNaN(locationAge)) {
      return res.status(400).json({ message: 'Age must be numbers' });
    }

    // Obter as informações do usuário autenticado
    const userid = req.userid;
    // Aqui você pode buscar mais informações do usuário no banco de dados usando o _id
    const user = await Users.findById(userid).select("username AdminPermission");

    let newLocation;

    if (user.AdminPermission) {
      // Criar um novo evento
      newLocation = new Locations({
        Type: locationType,
        Name: locationName,
        Description: locationDescription,
        AgeRecomendation: locationAge,
        Creator: userid,
        Reviews: [],
        Image: locationImage,
        Address: locationAdress,
        Status: "Active"
      })
    } else {
      // Criar um novo evento
      newLocation = new Locations({
        Type: locationType,
        Name: locationName,
        Description: locationDescription,
        AgeRecomendation: locationAge,
        Creator: userid,
        Reviews: [],
        Image: locationImage,
        Address: locationAdress,
        Status: "Pending"
      })
    }
    // Salvar o evento no banco de dados
    await newLocation.save();

    // Responder com sucesso
    res.status(201).json({ message: 'Event created successfully' });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal server error! create events' });
  }
});

export default router;