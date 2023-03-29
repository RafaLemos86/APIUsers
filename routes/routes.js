var express = require("express")
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require('../controllers/UsersController')

var adminAuth = require("../middleware/adminAuth")


// rota de listagem de usuarios
router.get('/', adminAuth, HomeController.index);

// rota para criacao de user
router.post('/user', UserController.create)

// pegando a lista de usuário
router.get("/user", UserController.index)

// pegando um usuário especifico
router.get("/user/:id", UserController.findUser)

// update usuario
router.put("/user", UserController.edit)

// deletando usuário
router.delete("/user/:id", UserController.delete)

// enviando token de recuperacao
router.post("/recovery", UserController.sendToken)

// mudando senha
router.post("/change", UserController.changePassword)

// login
router.post("/login", UserController.login)

module.exports = router;