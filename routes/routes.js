var express = require("express")
var router = express.Router();
var HomeController = require("../controllers/HomeController");

var UserController = require('../controllers/UsersController')



router.get('/', HomeController.index);

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

router.post("/recovery", UserController.sendToken)


router.post("/change", UserController.changePassword)


module.exports = router();