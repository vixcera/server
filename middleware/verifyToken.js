import jwt from "jsonwebtoken"

const verifyToken = async (request, response, next) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return response.status(403).json('token kosong')
    jwt.verify(token, process.env.token, (error) => error ? response.json(error.message) : next())
}

export default verifyToken ;