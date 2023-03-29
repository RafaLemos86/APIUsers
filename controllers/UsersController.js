// controller responsavel de manipular os metodos do usuario
var User = require('../models/User')
var recoverPassword = require("../models/recoveryPassword")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")
const secret = "StringAleatoria10%"

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

    // enviat o token para auteracao da senha
    async sendToken(req, res) {
        var email = req.body.email

        // criando token
        var result = await recoverPassword.create(email)

        // se deu tudo certo
        if (result.status) {
            // enviar token para a resposta
            res.status(200)
            res.send("" + result.token)
            return

            // algo deu errado
        } else {
            res.send(result)
            res.status(406)
        }
    };

    // mudando a senha do usuário
    async changePassword(req, res) {
        var { token, password } = req.body
        // verificando se o token é válido
        var tokenValid = await recoverPassword.validate(token)

        // token válido
        if (tokenValid.status) {
            // mudando a senha, recebe nova senha, id da tabela de users, id da tabela recovery
            await User.changePassword(password, tokenValid.token.id_user, tokenValid.token.id)
            res.status(200)
            res.send("OK")
            return
        } else {
            res.send(tokenValid)
            res.status(406)
            return
        }
    };

    async login(req, res) {
        var { email, password } = req.body
        // verificando se o email existe
        var user = await User.findUserByEmail(email)

        // email existe
        if (user) {
            // verificando se a senha está correta, retorna um BOOLEANO
            var corretPassword = await bcrypt.compare(password, user.password)
            if (corretPassword) {
                // gerando o token e enviando o email e o role do user
                var token = jwt.sign({ email: user.email, role: user.role }, secret)
                res.status(200)
                res.send({ status: true, token })

            } else {
                res.status(202)
                res.send({ status: false, err: "Senha incorreta" })
            }

        } else {
            res.status(406)
            res.send({ status: false, err: "usuário não encontrado" })
        }
    };
};


module.exports = new UserController();