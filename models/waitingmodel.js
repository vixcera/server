import mongoose from "mongoose";

const waiting = new mongoose.Schema({
    price : { type: Number },
    title : { type: String },
    desc  : { type: String },
    file  : { type: String },
    img   : { type: String },
    ctg   : { type: String },
    by    : { type: String },
    id    : { type: String }
}, 
{
    timestamps : true
})

export default mongoose.model("waiting", waiting)