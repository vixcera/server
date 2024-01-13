import jwt from 'jsonwebtoken';
import { contributor, users } from '../models/models.js';

const reftoken = async (request, response) => {
  try {
    const agent = request.headers['user-agent'] + '' + request.ip
    const user = await users.findOne({ where: { agent } }) || await contributor.findOne({ where: { agent } });
    if (!user) return response.sendStatus(403);
    const { id } = user;
    const { img } = user;
    const { username } = user;
    const { email } = user;
    const token = jwt.sign({
      username, id, email, img,
    }, process.env.token, { expiresIn: '15s' });
    response.json({ token });
  } catch (error) {
    console.log(error.message);
  }
};

export default reftoken;
