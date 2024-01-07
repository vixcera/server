import mongoose from "mongoose";

const contributor = new mongoose.Schema({
    username : { type: String },
    password : { type: String },
    reftoken : { type: String },
    amount   : { type: Number },
    email    : { type: String },
    agent    : { type: String },
    img      : { type: String },
    id       : { type: String }
}, {
    timestamps: true
})

export default mongoose.model('contributor', contributor)