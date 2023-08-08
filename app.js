const fs = require("fs");
const express = require("express");
const app = express();
let movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));
app.use(express.json());

app.get("/movies", (req, res) => {
  res.status(200).json({
    status: "ok",
    count: movies.length,
    data: {
      movies: movies,
    },
  });
});

app.get("/movies/:id", (req, res) => {
  let id = +req.params.id;
  let movie = movies.find((e) => e.id === id);
  if (!movie) res.status(404).send({ message: "Not Found" });
  res.status(200).send({
    status: "ok",
    data: {
      movies: movie,
    },
  });
});

app.patch("/movies/:id", (req, res) => {
  let id = +req.params.id;
  let UpdatedMovie = movies.find((e) => e.id === id);
  if (!UpdatedMovie) res.status(404).send({ message: "Not Found" });
  let index = movies.indexOf(UpdatedMovie);
  Object.assign(UpdatedMovie, req.body);
  movies[index] = UpdatedMovie;
  fs.writeFile("/movies.json", "Hello", (err) => {
    res.status(200).send({
      status: "ok",
      data: {
        movies: UpdatedMovie,
      },
    });
  });
});

app.post("/movies", (req, res) => {
  let newId = movies[movies.length - 1].id + 1;
  let newMovie = Object.assign({ id: newId }, req.body);
  movies.push(newMovie);
  fs.writeFile("./movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "ok",
      data: {
        movies: newMovie,
      },
    });
  });
});

app.listen(5000, () => {
  console.log("Running on localhost/5000...");
});
