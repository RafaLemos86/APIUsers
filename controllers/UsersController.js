// controller responsavel de manipular os metodos do usuario
var knex = require('../database/connection')


class UserController {
    async index(req, res) { }
    // cadastrando usuario
    async create(req, res) {
        var { email, password, name } = req.body

        if (email != undefined) {
            // procurando no banco se o email já existe
            knex
                .select('email')
                .where({ email })
                .table('users').then(rows => {
                    // email ja cadastrado
                    if (rows.length) {
                        // requisicao errada
                        res.status(400)
                        res.json({ err: 'email já existe' })

                    } else {
                        // email nao vazio e nao existe no banco
                        res.status(200);
                        res.send('Ok!')
                    }
                }).catch(err => {
                    console.log({ err: err, mensage: 'Happened a error' })
                })
            // email nao foi preenchido
        } else {
            res.status(400)
            res.json({ err: 'email nao preenchido' })
        }

    };
};


module.exports = new UserController();