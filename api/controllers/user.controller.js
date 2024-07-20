import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import Event from "../models/event.model.js";

export const test = (req, res) => {
    res.send('hello world!');
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(403, 'You can update only your account!'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                organizationName: req.body.organizationName,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true});

        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(403, 'You can delete only your account!'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }  
};

export const getUserEvents = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, 'You can get only your events!'));
    }
    try {
        const events = await Event.find({ creator: req.params.id });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
}