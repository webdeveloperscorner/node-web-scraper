var express = require("express"),
    cheerio = require("cheerio"),
    request = require("request"),
    mongoose = require("mongoose"),
    Noticia  = require("../models/noticia");
    app = express();

// Rutas de la API
// ==================================================================
var router = express.Router();

// Middleware para evitar CORSS
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.get('/noticias', function(req, res) {
    mongoose.connect('mongodb://localhost/noticiasdatabase');
    Noticia.find(function (err, noticias) {
        if (err) res.status(404).send('error');
        res.json(noticias);
        mongoose.disconnect();
    }).sort({'orden':'asc'});
});

app.use('/api',router);

app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
});