const knex = require("../database/connection")
const User = require("./User")

class passwordToken {
    async create(email) {
        var user = await User.findUserByEmail(email)

        if (user) {
            var token = Date.now()
            try {
                await knex("recoverypassword")
                    .insert({
                        token,
                        used: 0,
                        id_user: user.id
                    })

                return { status: true, token }
            } catch (err) {
                return { status: false, err: err }

            }

        } else {
            return { status: false, err: "O email não está cadastrado" }
        }
    };

    async isValid(token) {
        try {
            var resultToken = await knex("recoverypassword")
                .select()
                .where({ token })

            if (resultToken.length > 0) {
                var tk = resultToken[0]
                if (tk.used) {
                    return { status: false, err: "O token já foi usado" }

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