import express from 'express';
import { Locations } from "../mongo/esquemas.js";
import { authPage } from "../middleware/middleware.js";


const router = express.Router();

router.post('/addReview/:localId', authPage, async (req, res) => {
    try {
      if (!req.authenticated) {
        return res.status(401).json({ message: 'Unauthorized: authentication failed' });
      }
      const { localId } = req.params;
      const { classification, comment } = req.body;
      const userId= req.userid; 

      if (isNaN(classification) || classification < 1 || classification > 5) {
        return res.status(400).json({ message: 'Classificação inválida!' });
      }
      if(comment===""){
        return res.status(401).json({ message: 'Comentário em falta!' });
      }
  
      // Verifique se o usuário já deixou uma avaliação para este local
      const existingReview = await Locations.findOne({ _id: localId, 'Reviews.RevUserId': userId });
      if (existingReview) {
        return res.status(400).json({ message: 'Você já tem uma avaliação ativa deste local!' });
      }
  
      // Crie uma nova avaliação e adicione ao local no banco de dados
      const location = await Locations.findById(localId);
      location.Reviews.push({ RevUserId: userId, classification, comment });
      await location.save();
  
      res.status(201).json();
    } catch (error) {
      console.error('Error creating a review:', error);
      res.status(500).json({ message: 'Internal error creating review.' });
    }
});

router.delete('/deleteReview', authPage, async (req, res) => {
    try {
      if (!req.authenticated) {
        return res.status(401).json({ message: 'Unauthorized: authentication failed' });
      }

      const { localId, reviewId } = req.body;

      // Encontrar a localização pelo ID
      const location = await Locations.findById(localId).select("Reviews");
  
      if (!location) {
        return res.status(404).json({ message: 'Location not found.' });
      }

      // Verificar se a revisão com o ID fornecido existe na localização
      const reviewToRemove = location.Reviews.find(review => review._id.toString() === reviewId);
      
      if (!reviewToRemove) {
        return res.status(404).json({ message: 'Review not found.' });
      }
  
      // Remover a revisão com o ID fornecido
      await Locations.findByIdAndUpdate(localId, { $pull: { 'Reviews': { _id: reviewId } } });
  
      res.status(200).json();
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error while deleting review.' });
    }
});

router.get('/:localid', authPage, async (req, res) => {
    try {
      const localId = req.params.localid;
      let userId = null;
      
      if (req.authenticated) {
        userId = req.userid;
      }

      // Encontrar o local e popular os campos de avaliações com informações do usuário
      const local = await Locations.findById(localId).select("Reviews").populate('Reviews.RevUserId', 'username ProfileImage');;
  
      if (!local) {
        return res.status(404).json({ message: 'Local not found reviews' });
      }     

      res.status(200).json({ reviews: local, userId });
  
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Internal server error! reviews' });
    }
});


export default router;