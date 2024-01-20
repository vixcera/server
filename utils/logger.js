import chalk from "chalk"

const logger = async (request, response, next) => {
    const ip = request.ip;
    const method = request.method;
    const path = request.path;
    await next();

    console.log(chalk.magenta(`==> request from ${ip} : \t [ ${chalk.green(method)} => ${path} ]`));
} 

export default logger;