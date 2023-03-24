// controller responsavel de manipular os metodos do usuario
var knex = require('../database/connection')
var User = require('../models/User')

class UserController {
    async index(req, res) { }
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
};


module.exports = new UserController();