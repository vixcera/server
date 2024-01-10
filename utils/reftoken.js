import jwt from 'jsonwebtoken';
import { contributor, users } from '../models/models.js';
import detector from "./detector.js"

const reftoken = async (request, response) => {
  try {
    const ip = request.ip
    const head = request.headers['user-agent']
    const agent = head + '' + ip
    detector(head).then((data) => console.table(data))
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
