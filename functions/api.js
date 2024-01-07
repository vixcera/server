import serverless from "serverless-http"
import connectDB from "../config/database.js"
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"
import router from "../router/router.js"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const api = express();

connectDB()
dotenv.config()

api.use(cors({ credentials : true ,origin : ["https://vixcera.my.id", "http://localhost:5173"]}))
api.use(express.urlencoded({extended: true}))
api.use(fileUpload())
api.use(express.json())
api.use(cookieParser())
api.use(express.static("public"))
api.use("/", router);

export const handler = serverless(api);