import chalk from "chalk"
import geoip from "geoip-lite";
import device from "node-device-detector"

const logger = async (request, response, next) => {
    const ip = request.ip;
    const method = request.method;
    const path = request.path;
    await next();
    
    const check = new device({
        deviceAliasCode : false,
        clientIndexes   : true,
        deviceIndexes   : true,
    })

    const yellow = chalk.hex('#ff170')
    const place = geoip.lookup(ip)
    const info = check.detect(request.headers['user-agent'])

    console.log(chalk.magenta(`==> [ ${chalk.green(method)} ] request client : \n - IP     : ${yellow(ip)} \n - City   : ${yellow(place.city)} \n - Path   : ${yellow(path)} \n - Device : ${yellow(info.os.name)} \n`));
} 

export default logger;