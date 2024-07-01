import mongoose from "mongoose";


  


const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    visibility: {
        type: String,
        required: true,
        enum: ['public', 'private'],
    },
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjtNBgCacCwHhxVPj1ubPRygdT7X_7w_UrLQ&s",
    },

    creator: {
        type: String,
        required: true,
    },
    // disableRegistration: {
    //     type: Boolean,
    //     default: false,
    // },
    // registrationDeadline: {
    //     type: Date,
    // },
    attendees: [
        {
          name: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
            unique: true,
          },
        },
      ],
    
    
}, {timestamps: true});

const Event = mongoose.model('Event', eventSchema);

export default Event; 