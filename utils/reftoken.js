import jwt from 'jsonwebtoken';
import contributor from '../models/contributormodel.js';
import users from '../models/usermodel.js';

const reftoken = async (request, response) => {
  try {
    const { reftoken } = request.cookies;
    console.log(reftoken)
    const user = await users.findOne({ reftoken }) || contributor.findOne({ reftoken });
    if (!user || !reftoken) return response.sendStatus(403);
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
