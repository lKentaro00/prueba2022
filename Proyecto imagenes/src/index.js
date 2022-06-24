const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
require("dotenv").config();
const ModeloPelicula = require("./modelos");
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.listen(port, () => {
  console.log("Corriendo en http://localhost:", port);
});
//fin midleware
//Rutas de consulta
app.get("/api/peliculas", (req, res) => {
  ModeloPelicula.find()
    .then((data) => res.json(data), res.status(500))
    .catch((error) => res.json({ message: "error" }), res.status(200));
});

app.post("/api/pelicula", (req, res) => {
  console.log(req.body);
  let pelicula = new ModeloPelicula();
  pelicula.Titulo_pelicula = req.body.titulo;
  //inicio guiones al titulo

  function quitarespacios(title, caracter = "-") {
    if (typeof title != "string") {
      console.log("El titulo no es un string");
    }
    return title.replace(/\s+/g, caracter);
  }
  try {
    var title2 = quitarespacios(pelicula.Titulo_pelicula);
    console.log(title2);
  } catch (e) {
    console.log("Error", e.message);
  }
  pelicula.slug = title2;
  //Fin guiones al titulo
  pelicula.Director = req.body.director;
  //Guardarla imagen
  let imagen = req.files.variable;
  console.log(imagen);
  pelicula.Imagen.data = req.files.variable.data;
  pelicula.Imagen.contentType = req.files.variable.mimetype;
  //Fin guardar imagen
  pelicula.plataformas = req.body.plataforma;
  pelicula.F_lanzamiento = req.body.lanzamiento;
  pelicula.Ultima_Actualizacion = req.body.Actualizada;
  pelicula.save((err, pelicula) => {
    if (err)
      res.status(500).send({ mensaje: "Error al guardar en la bd ", err });
    res.status(200).send({ mensaje: "La pelicula fue registrada" });
  });
});
app.delete("/api/borrar/:id", (req, res) => {
  let id = req.params.id;
  ModeloPelicula.remove({ _id: id })
    .then((data) => res.json(data), res.status(500))
    .catch((error) => res.json({ message: "error" }), res.status(200));
});

app.put("/api/actualizar/:id", (req, res) => {
  const emp = {
    Titulo_pelicula: req.body.titulo,
    Director: req.body.director,
    Ultima_Actualizacion: req.body.Actualizada,
    plataformas: req.body.plataforma,
  };

  ModeloPelicula.findByIdAndUpdate(
    req.params.id,
    { $set: emp },
    { new: true },
    (err, data) => {
      if (err) {
        res
          .status(200)
          .json({ code: 200, message: "Se actualizo correctamente" });
      } else {
        console.log(err);
      }
    }
  );
});

//fin ruta de consulta

//Conectar MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("conectado a la base de datos"))
  .catch((error) => console.error(error));
