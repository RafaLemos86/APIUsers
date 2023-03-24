var knex = require("../database/connection")
var bcrypt = require("bcrypt")


class User {

    // cadastrando usuario
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

    // encontrado emails iguais
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

    // encontrando todos os usuarios
    async findAll() {
        try {
            var result = await knex("users")
                .select(["id", "name", "email", "role"])

            return result;


        } catch (err) {
            console.log(err)
            return []
        }
    }

    async findUserById(id) {
        try {
            // pesquisando no banco
            var user = await knex("users")
                .select(["id", "name", "email", "role"])
                .where({ id })


            if (user.length > 0) {
                // se o usario for encontrado, é somente 1, pois o id é unico
                // retorna um json
                return user[0]

            } else {
                // usuario nao encontrado
                return undefined
            }

        } catch (err) {
            console.log(err)
            return undefined
        }
    }

}


module.exports = new User()