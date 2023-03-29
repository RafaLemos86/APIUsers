var User = require("./User")
var knex = require("../database/connection")



class recoverPassword {
    // criando a recuperacao pelo email
    async create(email) {
        // verificando se o email é válido
        var userResult = await User.findUserByEmail(email)

        if (userResult) {
            try {
                var token = Date.now();
                await knex("recoverypassword")
                    .insert({
                        id_user: userResult.id,
                        used: 0,
                        token: token
                    });

                return { status: true, token }

            } catch (err) {
                return { status: false, err: err }
            }
        } else {
            return { status: false, err: "O email não está cadastrado" }
        }

    };

    async validate(token) {
        try {
            // verificando se o token existe
            var result = await knex("recoverypassword")
                .select()
                .where({ token })

            // existe
            if (result.length > 0) {
                var tk = result[0]

                // token ja foi usado
                if (tk.used) {
                    return { status: false, msg: "Token já foi usado" }
                    // nao foi usado ainda
                } else {
                    //    
                    return { status: true, token: tk }
                }
                // token nao existe
            } else {
                return { status: false }
            }
        } catch (err) {
            return { status: false, err: err }
        }
    };

    async setUsed(id) {
        try {
            await knex("recoverypassword")
                .update({
                    used: 1
                }).where({
                    id
                })
            return { status: true }
        } catch (err) {
            return { status: false, err: err }
        }

    }


}

module.exports = new recoverPassword()