var knex = require("../database/connection")
var bcrypt = require("bcrypt")
const passwordToken = require("./passwordToken")


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
    };

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
    };

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
    };

    // encontrando usuario pelo id
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
    };

    // encontrando usuario pelo id
    async findUserByEmail(email) {
        try {
            // pesquisando no banco
            var user = await knex("users")
                .select("*")
                .where({ email })


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
    };


    async update(id, email, name, role) {
        try {
            // procurando usuario
            var user = await this.findUserById(id)

            // usuário encontrado
            if (user) {
                var editUser = {}

                // se o usuário quer trocar o email
                if (email) {

                    // verificando se ja existe o novo email
                    var emailEqual = await this.findEmail(email)

                    // nao existe o novo email
                    if (!emailEqual) {
                        editUser.email = email

                        // email já cadastrado
                    } else {
                        return { status: false, err: "E-mail já cadastrado" }
                    }

                    // email será o mesmo que ja cadastrado
                } else {
                    editUser.email = user.email
                }

                // quer mudar o nome
                if (name) {
                    editUser.name = name

                    // se nao quiser, nome segue o mesmo
                } else {
                    editUser.name = user.name
                }

                // quer mudar a role
                if (role) {
                    editUser.role = role

                    // role segue a mesma
                } else {
                    editUser.role = user.role
                }

                try {
                    await knex('users')
                        .update(editUser)
                        .where({ id })

                    return { status: true }

                } catch (err) {
                    return { status: false, err: err }
                }

                // usuário nao encontrado no banco
            } else {
                return { err: "Usuário não encontrado" }

            }

        } catch (err) {
            return { status: false, err: err }

        }
    };

    // deletando um usuario
    async _delete(id) {
        // verificando se usuario existe
        var user = await this.findUserById(id);

        // se existir
        if (user) {
            // deletando no banco
            try {
                await knex("users")
                    .delete()
                    .where({ id })

                return { status: true }

                // ocorreu algum erro
            } catch (err) {
                return { status: false, err: err }
            }
            // usuario nao existe
        } else {
            return { status: false, err: "usuário não existe" }
        }
    };

    // mudando a senha id_user é o id da tabela user, id_token é o id da tabela de recuperacao
    async changePassword(newPassword, id_user, id_token) {
        // fazendo o hash da nova senha
        var hash = await bcrypt.hash(newPassword, 10)

        // inserindo no banco
        await knex("users")
            .update({ password: hash })
            .where({ id: id_user })

        // setando token como usado
        await passwordToken.setUsed(id_token)




    }

}


module.exports = new User()