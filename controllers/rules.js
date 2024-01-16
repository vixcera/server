import jwt from "jsonwebtoken"
import date from "date-time"
import { users, contributor } from "../models/models.js"

export const shareCookie = async (request, response) => {
    response.cookie("shared_cookie", "shared_cookie", { httpOnly: true, sameSite: "None", secure: true })
    response.sendStatus(200)
}

export const checkAllowedCookie = async (request, response) => {
    const cookie = request.cookies.shared_cookie
    if (!cookie) return response.sendStatus(404)
    return response.sendStatus(200)
}

export const reftoken = async (request, response) => {
    try {
        const reftoken = request.cookies.reftoken
        const now = date({ date: new Date(), showMilliseconds: true })
        const user = await users.findOne({ where: { reftoken } }) || await contributor.findOne({ where: { reftoken } });
        if (!user) {
          console.log(`==> new request token from : ${request.ip} \t (not found) (${now})`)
          return response.sendStatus(403)
        };
        const { vid, username, email, img } = user;
        const token = jwt.sign({ vid, username, email, img }, process.env.token)
        response.json({ token });
        console.log(`==> new request token from : ${request.ip} \t (success)`);
    } catch (error) {
        console.log(`==> new request token from : ${request.ip} \t (undefined)`);
        return response.sendStatus(403)
    }
}