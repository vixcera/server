import device from "node-device-detector"

const check = new device({
    deviceAliasCode : false,
    clientIndexes   : true,
    deviceIndexes   : true,
})

const detector = async (agent) => {
    const result = check.detect(agent)
    return result
}

export default detector;