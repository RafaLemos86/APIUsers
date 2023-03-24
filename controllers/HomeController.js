class HomeController {

    async index(req, res) {
        res.send("API user");
    }

}

module.exports = new HomeController();