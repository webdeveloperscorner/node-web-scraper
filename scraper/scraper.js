var cheerio = require("cheerio"),
    request = require("request"),
    mongoose = require("mongoose"),
    Noticia  = require("../models/noticia");

    mongoose.connect('mongodb://localhost/noticiasdatabase');

    // Remove de todas las noticias
    Noticia.remove({},function (err,removed) {
        if (err) console.error(err);
        request('http://www.elpais.com', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                $('.division_columnas .columna_principal .article').each(function(i, element){
                    var textoTitular = $('h2 a',this).text(),
                        subtitulo = $(this).children('p').text(),
                        linkTitular = $('h2 a',this).attr('href'),
                        urlImagen = undefined;

                    if($(element).find('img')){
                        urlImagen = $(element).find('img').data('src');
                    }
                    if($('script',element).html()) {
                        var r = $('script',element).html().replace('//<![CDATA[','');
                        var spt = r.split(';')[0];
                        //Primer fotograma del vídeo
                        urlImagen = 'http://ep02.epimg.net' + spt.match(/'([^']+)'/)[1];
                    }

                    if(linkTitular.indexOf('/') == 0){
                        linkTitular = 'http://www.elpais.com'+ linkTitular;
                    }

                    var noticia = new Noticia({ titulo: textoTitular, subtitulo: subtitulo, imagen: urlImagen, enlace: linkTitular, orden: i });
                    noticia.save(function (err) {
                        if (err) console.error(err);
                    });
                });

            }
        });
    });
