const knex = require("../database/connection")
const User = require("./User")

class passwordToken {
    // enviando token recuperacao
    async create(email) {
        // verificando se email existe
        var user = await User.findUserByEmail(email)

        // existe
        if (user) {
            // token é a data em milisegundos
            var token = Date.now()
            try {
                // inserindo na tabela de recuperacap
                await knex("recoverypassword")
                    .insert({
                        token,
                        used: 0,
                        // chave estrangeira da tabela de recovery é o id da tabela users
                        id_user: user.id
                    })

                // deu tudo certo
                return { status: true, token }
                // algo deu errado
            } catch (err) {
                return { status: false, err: err }

            }
            // email nao existe
        } else {
            return { status: false, err: "O email não está cadastrado" }
        }
    };

    // verificando se token é válido
    async isValid(token) {
        try {
            // procurando o token na tabela
            var resultToken = await knex("recoverypassword")
                .select()
                .where({ token })

            // token existe
            if (resultToken.length > 0) {
                // recebendo o usuario que pertence ao token
                var tk = resultToken[0]
                // verificando se ja foi usado
                if (tk.used) {
                    return { status: false, err: "O token já foi usado" }

                    // retornando o usuario 
                } else {
                    return { status: true, token: tk }
                }

            } else {
                return { status: false, err: "O token é inválido" }
            }
        } catch (err) {
            return { status: false, err: err }
        };


    };

    // mudando token como usado
    async setUsed(id) {
        try {
            await knex("recoverypassword")
                .update({
                    used: 1
                }).where({
                    id
                })
        } catch (err) {
            return { status: false, err: err }
        }
    }


}


module.exports = new passwordToken()