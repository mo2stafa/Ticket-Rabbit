import Event from "../models/event.model.js";
export const createEvent = async (req, res, next) => {
    try {  
        const newEvent = await Event.create(req.body);
        return res.status(201).json(newEvent);
    } catch (error) {   
        next(error);
    }

};