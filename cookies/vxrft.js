import jwt from "jsonwebtoken"
import date from "date-time"
import chalk from "chalk"
import { users, contributor } from "../models/models.js"

const vxrft = async (request, response) => {
    try {
        const vxrft = request.cookies.vxrft
        const now = date({ date: new Date(), showMilliseconds: true })
        const user = await users.findOne({ where: { vxrft } }) || await contributor.findOne({ where: { vxrft } });
        if (!user) {
          console.log(chalk.red(`==> (not found) new request token from : ${request.ip} \t (${now})`))
          return response.sendStatus(200)
        };
        const { vid, username, email, img } = user;
        const token = jwt.sign({ vid, username, email, img }, process.env.token)
        response.json({ token });
        console.log(chalk.green(`==> (success) new request token from : ${request.ip} \t `));
    } catch (error) {
        console.log(chalk.red(`==> (failure) new request token from : ${request.ip} \t `));
        return response.sendStatus(200)
    }
}

export default vxrft