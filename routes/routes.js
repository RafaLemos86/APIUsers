var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");

var User = require('../controllers/UsersController')


router.get('/', HomeController.index);
// rota para criacao de user
router.post('/user', User.create)

module.exports = router;