var bodyParser = require('body-parser')
var express = require("express")
var app = express()
var router = require("./routes/routes")
var knex = require('./database/connection')



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use("/", router);






app.listen(1088, () => {
    console.log("Servidor rodando")
});
