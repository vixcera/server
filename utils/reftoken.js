import jwt from 'jsonwebtoken';
import contributor from '../models/contributormodel.js';
import users from '../models/usermodel.js';

const reftoken = async (request, response) => {
  try {
    const ip = request.socket.remoteAddress || request.ip
    const head = request.headers['user-agent']
    const agent = head + '' + ip
    const user = await users.findOne({ agent }) || await contributor.findOne({ agent });
    console.log(user)
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
