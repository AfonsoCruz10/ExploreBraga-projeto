// rlocations.js
import express from 'express';
import { Locations } from "../models/esquemas.js";

const router = express.Router();

router.get('/', async (request, response) => {
  try {

    const loc = await Locations.find({});
    
    return response.status(200).json({
      count: loc.length,
      data: loc,
    });
  } catch (error) {
    console.log("Error fetching locations:", error.message);
    response.status(500).json({ message: error.message });
  }
});

export default router;