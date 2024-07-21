import Event from "../models/event.model.js";
import { errorHandler } from "../utils/error.js";
export const createEvent = async (req, res, next) => {
    try {  
        const newEvent = await Event.create(req.body);
        return res.status(201).json(newEvent);
    } catch (error) {   
        next(error);
    }

};



export const deleteEvent = async (req, res, next) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return next(errorHandler(404, 'Event not found!'));
    }

    if (event.creator !== req.user.id) {
        return next(errorHandler(403, 'You can delete only your events!'));
    }

    try{
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json('Event has been deleted!');
    } catch (error) {
        next(error);
    }
}


export const updateEvent = async (req, res, next) => {

    const event = await Event.findById(req.params.id);
    if (!event) {
        return next(errorHandler(404, 'Event not found!'));
    }

    if (event.creator !== req.user.id) {
        return next(errorHandler(403, 'You can update only your events!'));
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {new: true});    
        res.status(200).json(updatedEvent);
    } catch (error) {
        next(error);
    }
}