import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(`${process.env.mongourl}`, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;

export default db;