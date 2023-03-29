const secret = "StringAleatoria10%"
var jwt = require("jsonwebtoken")

module.exports = function (req, res, next) {
    // inicio do código para pegar o token disponivel na documentacao do JWT
    const authToken = req.headers["authorization"]

    if (authToken) {
        const bearer = authToken.split(' ')
        var token = bearer[1]

        try {
            var decoded = jwt.verify(token, secret)
            if (decoded.role == 1) {
                next()
            } else {
                res.status(403)
                res.send("Usuário não autenticado")
                return
            }

        } catch (err) {
            res.status(403)
            res.send("Usuário não autenticado")
            return
        }




        // nao autenticado
    } else {
        res.status(403)
        res.send("Usuário não autenticado")
        return
    }
}