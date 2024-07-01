import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        unique: false, //change to false 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjtNBgCacCwHhxVPj1ubPRygdT7X_7w_UrLQ&s",
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;