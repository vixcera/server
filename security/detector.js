import device from "node-device-detector"
import geoip from "geoip-lite"

const detector = async (request, response, next) => {

    const check = new device({
        deviceAliasCode : false,
        clientIndexes   : true,
        deviceIndexes   : true,
    })
    
    if (request.headers.origin !== `${process.env.clientUrl}`) {
        console.log(`==> ANONYMOUS REQUEST FROM: ${request.ip}`)
        console.table(geoip.lookup(request.ip))
        const result = check.detect(request.headers['user-agent'])
        console.table(result)
    }

    next()
}

export default detector;