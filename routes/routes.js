var express = require("express")
var router = express.Router();
var HomeController = require("../controllers/HomeController");

var UserController = require('../controllers/UsersController')



router.get('/', HomeController.index);
// rota para criacao de user
router.post('/user', UserController.create)

router.get("/user", UserController.index)

router.get("/user/:id", UserController.findUser)

module.exports = router;