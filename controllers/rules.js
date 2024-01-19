import jwt from "jsonwebtoken"
import date from "date-time"
import { users, contributor } from "../models/models.js"

export const checkAllowedCookie = async (request, response) => {
    const cookie = request.cookies.VXSRF
    if (!cookie) return response.sendStatus(404)
    return response.sendStatus(200)
}

export const reftoken = async (request, response) => {
    try {
        const reftoken = request.cookies.reftoken
        response.clearCookie("shared_cookie")
        const now = date({ date: new Date(), showMilliseconds: true })
        const user = await users.findOne({ where: { reftoken } }) || await contributor.findOne({ where: { reftoken } });
        if (!user) {
          console.log(`==> (not found) new request token from : ${request.ip} \t (${now})`)
          return response.sendStatus(200)
        };
        const { vid, username, email, img } = user;
        const token = jwt.sign({ vid, username, email, img }, process.env.token)
        response.json({ token });
        console.log(`==> (success) new request token from : ${request.ip} \t `);
    } catch (error) {
        console.log(`==> (failure) new request token from : ${request.ip} \t `);
        return response.sendStatus(200)
    }
}