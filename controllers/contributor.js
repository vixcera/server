import contributor from "../models/contributormodel.js"
import nodemailer from "../utils/nodemailer.js";
import randomize from "../utils/randomize.js";
import jwt from "jsonwebtoken"
import argon2 from "argon2"

export const contributor_login = async(request, response) => {
    const agent = request.headers['user-agent']
    const { email, password } = request.body;
    const cont = await contributor.findOne({ email })
    if (!cont) return response.status(404).json("account not found")
    try {
        const match = await argon2.verify(cont.password, password)
        if (!match) return response.status(403).json("password doesn't match!")
        
        const token = jwt.sign({
            id          : cont.id,
            img         : cont.img,
            email       : cont.email,
            username    : cont.username,
            password    : cont.password,
        },  process.env.token, {
            expiresIn: '20s',
        })

        const reftoken = jwt.sign({
            id          : cont.id,
            img         : cont.img,
            email       : cont.email,
            username    : cont.username,
            password    : cont.password,
        },  process.env.reftoken, {
            expiresIn: '1d'
        })

        await contributor.updateOne({ email }, { reftoken, agent })
        response.cookie("reftoken", reftoken, {httpOnly : true, secure: true, maxAge : 24 * 60 * 60 * 1000})
        response.json({token})

    }   catch (error) {
        return response.status(403).json(error.message)
    }
}

export const contributor_register = async(request, response) => {
    const { username, email, password } = request.body;
    const cont = await contributor.findOne({ email })
    if (!email.includes("@gmail.com")) return response.status(403).json("please input a valid email!")
    if (cont) return response.status(302).json("email has been registered, please enter another email!")

    if (email && username && password) {
        const token = jwt.sign({
            id       : randomize(),
            email    : email,
            username : username,
            password : password
        },  process.env.token, {
            expiresIn: "15m"
        })
        const url = `${request.protocol}://${request.get('host')}/confirm/contributor/${token}`
        nodemailer(email, username, url, response)

    }   else {
        return response.status(400).send('incomplete data')
    }
}

export const contributor_confirm = async(request, response) => {
    const token = request.params.token
    if (!token) return response.status(404).json("data not found!")

    jwt.verify(token, process.env.token, async (error) => {
        if (error) return response.status(400).json(error.message)

        const data = jwt.decode(token)
        const cont = await contributor.findOne({ email : data.email })
        if (cont) return response.status(302).redirect(`${process.env.clientUrl}/login/contributor`)
        const hash = await argon2.hash(data.password)
        await contributor.create({
            id       : data.id,
            email    : data.email,
            username : data.username,
            password : hash
        })
        response.status(201).redirect(`${process.env.clientUrl}/login/contributor`)
    })
}

export const contributor_logout = async (request, response) => {
    const reftoken = request.cookies.reftoken
    if (!reftoken) return response.status(403).json("Oops... Something Wrong!")
    const cont = await contributor.findOne({ reftoken })
    if (!cont) return response.status("you have been logged out!")
    await contributor.updateOne({ reftoken }, { reftoken: null, agent: null })
    response.clearCookie("reftoken")
    response.status(200).json("successfully logged out")
}