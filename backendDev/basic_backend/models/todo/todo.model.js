import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    }, 
    completed: {
        type: Boolean,
        default: false
    },
    createtdBy: {
        type: mongoose.Schema.Types.ObjectId, //reference to user model
        ref: "User" 
    }

}, {timestamps: true});
export const Todo = mongoose.model("Todo", todoSchema);