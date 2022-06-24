const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var modeloPelicula = Schema({
  Titulo_pelicula: {
    type: String,
  },
  slug: {
    type: String,
  },
  Director: {
    type: String,
  },
  Imagen: {
    data: Buffer,
    contentType: String,
  },
  F_lanzamiento: {
    type: Date,
  },
  Ultima_Actualizacion: {
    type: Date,
  },
  plataformas: [String],
});

const model = mongoose.model("ModeloPelicula", modeloPelicula);

module.exports = model;
