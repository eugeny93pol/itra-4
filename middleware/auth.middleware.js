const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (request, response, next) => {
    if (request.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = request.headers.authorization.split(' ')[1]
        if(!token) {
            return response.status(401).json({message: "No authorisation"})
        }
        const decoded = jwt.verify(token, config.get("jwtSecret"))
        request.user = decoded
        next()
    } catch (e) {
        return response.status(401).json({message: "No authorisation"})
    }
}