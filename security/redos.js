import safe from "safe-regex";
import chalk from "chalk";

const redos = async (request, response, next) => {
    const inputs = Object.values(request.body || request.query || request.params)
    for (const input of inputs) {
        const safed = safe(input.toString())
        if (!safed) {
            console.log(chalk.red(`(unsafe) input: ${input}`))
            return response.status(400).json("permissions error")
        }
    }
    next()
}

export default redos;