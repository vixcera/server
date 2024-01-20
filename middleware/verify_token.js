import jwt from 'jsonwebtoken';
import { contributor } from '../models/models.js';

const verify_token = async (request, response, next) => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return response.status(403).json('you are not a contributor');
  jwt.verify(token, process.env.token, async (error) => {
    if (error) return response.status(403).json("you are not a contributor")
    const decode = jwt.decode(token)
    const user = await contributor.findOne({ where: { email : decode.email } })
    if (!user) return  response.status(404).redirect(`${process.env.clientUrl}`)
    next()
  });
};

export default verify_token;
