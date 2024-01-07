import contributor from "../models/contributormodel.js"
import users from "../models/usermodel.js"
import jwt from "jsonwebtoken"

const reftoken = async (request, response) => {
    try {
        const reftoken = request.cookies.reftoken
        const user = await users.findOne({ reftoken }) || contributor.findOne({ reftoken })
        if (!user || !reftoken) return response.sendStatus(403)
        const id = user.id
        const img = user.img
        const username = user.username
        const email = user.email
        const token = jwt.sign({ username, id, email, img}, process.env.token, { expiresIn: '15s' })
        response.json({ token })
    }   catch (error) {
        console.log(error.message)
    }
}

export default reftoken;