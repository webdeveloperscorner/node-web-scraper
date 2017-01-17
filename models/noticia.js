
    var mongoose = require("mongoose"),
        Noticia = mongoose.model('Noticia', { titulo: String, subtitulo: String, imagen: String, enlace: String, orden: Number });

    module.exports = Noticia;