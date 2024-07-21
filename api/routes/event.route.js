import express from 'express';
import { createEvent, deleteEvent, updateEvent } from '../controllers/event.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post("/create", verifyToken , createEvent);

router.delete("/delete/:id", verifyToken, deleteEvent);

router.post("/update/:id", verifyToken, updateEvent);

export default router;