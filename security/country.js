import geoip from "geoip-lite"
import chalk from "chalk"

const country = async (request, response, next) => {
    const clientIP = request.ip
    const geo = geoip.lookup(clientIP)
    const allowed = ['ID']
    if (geo && allowed.includes(geo.country)) return next()
    response.sendStatus(502)
    console.log(chalk.bold.red(`==> blocked request from: ${clientIP} (${geo.city}) \t [ ${request.method} => ${request.path} ]`))
}

export default country;