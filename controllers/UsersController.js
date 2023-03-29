// controller responsavel de manipular os metodos do usuario
const User = require('../models/User')
const passwordToken = require("../models/passwordToken")

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

        // usuario encontrado
        if (result) {
            res.status(200)
            res.json(result)
            return
            // usuario nao encontrado
        } else {
            res.status(404)
            res.json({})
            return
        }

    }

    // update de usuário
    async edit(req, res) {
        // desestruturando os daods
        var { id, name, email, role } = req.body

        // fazendo o update
        var result = await User.update(id, email, name, role)

        // se deu certo
        if (result.status) {

            res.send("OK")
            res.status(200)
            return

            // ocorreu um erro
        } else {
            res.send({ status: result.status, err: result.err })
            res.status(406)
            return
        }
    };

    async delete(req, res) {
        // pegando id da URL
        var id = req.params.id

        // tentando deletar no banco
        var result = await User._delete(id)

        // deu tudo certo
        if (result.status) {
            res.status(200)
            res.send("Usuário deletado")

            return
            // houve um erro
        } else {
            res.status(406)
            res.send({ status: result.status, err: result.err })
        }

    };

    async sendToken(req, res) {
        var email = req.body.email

        var result = await passwordToken.create(email)

        if (result.status) {
            res.status(200)
            res.send(result)
        } else {
            res.status(406)
            res.send(result)
        }

    };

    async changePassword(req, res) {
        var { token, newPassword } = req.body;
        var result = await passwordToken.isValid(token)

        if (result.status) {
            await User.changePassword(newPassword, result.token.id_user, result.token.id)
            res.send("OK")
            res.status(200)
            return
        } else {
            res.status(406)
            res.send(result)
        }
    }
};


module.exports = new UserController();