// rlocations.js
import express from 'express';
import { Locations, Users } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";

const router = express.Router();

router.get('/seebycategories', async (req, res) => {
  try {
    const loc = await Locations.find({ Status: "Active" });

    const usernamePromises = loc.map(async (local) => {
      const user = await Users.findById(local.Creator).select('username ProfileImage');
      const showLocations = {
        ...local.toObject(),
        username: user.username,
        Image: user.ProfileImage
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

router.get('/:id', authPage, async (req, res) => {
  try {
    const localId = req.params.id;
    let check = false;

    // Buscar o local pelo ID
    const local = await Locations.findById(localId);

    if (!local) {
      return res.status(404).json({ message: 'Local not found' });
    }

    // Buscar o nome de usuário do criador do local
    const usernameLocal = await Users.findById(local.Creator).select("username ProfileImage");

    const showLocal = {
      ...local.toObject(),
      username: usernameLocal.username,
      CreatorProfilePhoto: usernameLocal.ProfileImage
    };

    // Buscar informações de usuário para cada avaliação
    const reviewsWithUserInfo = [];
    for (const review of showLocal.Reviews) {
      const user = await Users.findById(review.username).select("username ProfileImage");
      const reviewWithUserInfo = {
        ...review,
        username: user.username,
        profilePhoto: user.ProfileImage
      };
      reviewsWithUserInfo.push(reviewWithUserInfo);
    }
    showLocal.Reviews = reviewsWithUserInfo;

    res.status(200).json({ local: showLocal });

  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error! getid' });
  }
});


router.get('/:locationId/seeReviews', async (req, res) => {
  try {
    const { locationId } = req.params;

    // Buscar o local pelo ID
    const location = await Locations.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Local not found' });
    }

    // Mapear cada revisão para adicionar o nome do usuário
    const reviewsWithUsernames = await Promise.all(location.Reviews.map(async (review) => {
      // Encontre o usuário pelo ID
      const user = await Users.findById(review.username).select("username ProfileImage");
      if (user) {
        // Se o usuário existir, adicione o nome do usuário à revisão
        return {
          ...review.toObject(), // Converta a revisão em um objeto JavaScript simples
          username: user.username, // Adicione o nome de usuário à revisão
          ProfileImage: user.ProfileImage // Adicione a imagem de perfil do usuário à revisão
        };
      } else {
        // Se o usuário não existir, mantenha apenas o ID do usuário na revisão
        return review;
      }
    }));

    res.status(200).json({ reviews: reviewsWithUsernames });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error! get reviews' });
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


router.post('/:locationId/addReview', authPage, async (req, res) => {
  try {
    const { locationId } = req.params;
    const { userId, classification, comment } = req.body;

    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    // Verifique se o usuário já deixou uma avaliação para este local
    const existingReview = await Locations.findOne({ _id: locationId, 'Reviews.username': userId });
    if (existingReview) {
      return res.status(400).json({ message: 'Você já tem uma review ativa deste local!' });
    }

    if (isNaN(classification) || classification < 1 || classification > 5) {
      return res.status(400).json({ message: 'Classificação inválida!' });
    }

    // Crie uma nova avaliação e adicione ao local no banco de dados
    const location = await Locations.findById(locationId);
    location.Reviews.push({ username: userId, classification, comment });
    await location.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Error creating a review:', error);
    res.status(500).json({ message: 'Internal error creating review.' });
  }
});

router.put('/:locationId/editReview/:reviewId', authPage, async (req, res) => {
  try {
    const { locationId, reviewId } = req.params;
    const { userId, classification, comment } = req.body;

    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    if (isNaN(classification) || classification < 1 || classification > 5) {
      return res.status(400).json({ message: 'Not valid classification!' });
    }

    // Verificar se a revisão pertence ao usuário autenticado
    const reviewToUpdate = await Locations.findOne({ _id: locationId, 'Reviews._id': reviewId, 'Reviews.username': userId });

    if (!reviewToUpdate) {
      return res.status(404).json({ message: 'Review not found or does not belong to the authenticated user.' });
    }

    // Atualizar a revisão no banco de dados
    const updatedReview = await Locations.findOneAndUpdate(
      { _id: locationId, 'Reviews._id': reviewId },
      { $set: { 'Reviews.$.classification': classification, 'Reviews.$.comment': comment } },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Failed to update review.' });
    }

    res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error while updating review.' });
  }
});

router.put('/:locationId/addToFavorites', authPage, async (req, res) => {
  try {
    const { locationId } = req.params;
    const { userId } = req.body;

    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    if (!userId || !locationId) {
      return res.status(400).json({ message: 'Bad request: Missing userId or locationId' });
    }

    // Use a operação atômica do MongoDB para adicionar ou remover o local da lista de favoritos
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let message;
    if (user.LocalFavorites.includes(locationId)) {
      // remover da lista
      await Users.findByIdAndUpdate(userId, { $pull: { 'LocalFavorites': locationId } });
      message = 'Local removido dos favoritos';
    } else {
      // Adicionar o local à lista do utilizador
      await Users.findByIdAndUpdate(userId, { $push: { 'LocalFavorites': locationId } });
      message = 'Local adicionado aos favoritos';
    }

    res.status(200).json({ message });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Internal server error while adding to favorites.' });
  }
});






router.delete('/:locationId/deleteReview/:reviewId', authPage, async (req, res) => {
  try {
    const { locationId, reviewId } = req.params;

    if (!req.authenticated) {
      return res.status(401).json({ message: 'Unauthorized: authentication failed' });
    }

    // Encontrar a localização pelo ID
    const location = await Locations.findById(locationId);

    if (!location) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    // Verificar se a revisão com o ID fornecido existe na localização
    const reviewToRemove = location.Reviews.find(review => review._id.toString() === reviewId);

    if (!reviewToRemove) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Remover a revisão com o ID fornecido
    await Locations.findByIdAndUpdate(locationId, { $pull: { 'Reviews': { _id: reviewId } } });

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error while deleting review.' });
  }
});







export default router;