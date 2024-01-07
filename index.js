import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"
import router from "./router/router.js"
import db from "./config/database.js"
import express from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"

const app = express()
const port = 3000
const server = new http.createServer(app)

try {
    db.once("open", () => console.log("==> mongodb connected!"))
}   catch (error) {
    console.log(error)
}


dotenv.config()
app.use(cors({ credentials : true ,origin : ["https://vixcera.my.id", "http://localhost:5173"]}))
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))
app.use(router)

server.listen(port, (error) => {(error) ? console.log(error.msessage) : console.log('==> server running')})