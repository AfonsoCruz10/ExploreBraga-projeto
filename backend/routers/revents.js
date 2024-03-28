// rvents.js
import express from 'express';
import { Events } from "../models/esquemas.js";

const router = express.Router();

router.get('/', async (request, response) => {
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
    response.status(500).json({ message: error.message });
  }
});

export default router;
