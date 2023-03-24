// controller responsavel de manipular os metodos do usuario
var User = require('../models/User')

class UserController {
    async index(req, res) {

        var allUsers = await User.findAll()
        res.json(allUsers)

    }
    // cadastrando usuario
    async create(req, res) {
        var { email, password, name } = req.body

        if ((email != undefined) && (email.length > 5) && (name.length > 0) && (password.length > 0)) {
            // procurando no banco se o email já existe
            var emailEqual = await User.findEmail(email)

            // nao existe emais iguais
            if (!emailEqual) {
                await User.new(
                    email,
                    password,
                    name
                )

                res.status(200)
                res.send("OK")
                return;

                // foi encontrado email iguais
            } else {
                res.status(406)
                res.json({ err: 'email ja cadastrado' })
                return;
            }


            // campo nao preenchido
        } else {
            res.status(400)
            res.json({ err: 'campo nao preenchido' })
            return;
        }

    };

    async findUser(req, res) {
        var id = req.params.id
        var result = await User.findUserById(id)

        // result encontrado
        if (result) {
            res.status(200)
            res.json(result)
            return
        } else {
            res.status(404)
            res.json({})
            return
        }

    }
};


module.exports = new UserController();