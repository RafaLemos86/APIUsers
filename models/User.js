var knex = require("../database/connection")
var bcrypt = require("bcrypt")


class User {
    async new(email, password, name, role = 0) {

        try {

            // senha decodificada, o numero 10 significa o numero de saltos do hash
            var hash = await bcrypt.hash(password, 10)

            await knex('users')
                .insert({
                    email,
                    password: hash,
                    name,
                    role: role
                })
        } catch (err) {
            console.log(err)
        }
    }

    async findEmail(email) {
        try {
            // resultado sera um array de emails iguais
            var result = await knex("users")
                .select("email")
                .where({ email })

            // foi encontrado email iguais
            if (result.length > 0) {
                return true
                // nao ha email iguais
            } else {
                return false
            }

        } catch (err) {
            console.log(err)
            return false;
        }
    }

}


module.exports = new User()