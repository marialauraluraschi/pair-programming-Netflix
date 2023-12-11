const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dbConnect = require('./config/connection');
const Movie = require('./models/Movies');
const mongoose = require('mongoose');
const Favourite = require('./models/Favourite');

const server = express();
server.use(cors());
server.use(express.json());
server.set('view engine', 'ejs');

const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_freedb_ClassPair',
    password: 'NZ97nx?gxv7Ke$9',
    database: 'freedb_Class Pair',
  });
  return connection;
}

dbConnect();

server.get('/movie_all_mongo', (req, res) => {
  const query = Movie.find()
    .sort({ title: 1 })
    .then((result) =>
      res.json({
        success: true,
        movies: result,
      })
    )
    .catch((error) => {
      console.log(error);
    });
});

server.get('/movie/:idMovies', async (req, res) => {
  const foundMovie = 'SELECT * FROM  movies WHERE idMovies=?';
  const connection = await getConnection();
  const [results] = await connection.query(foundMovie, [req.params.idMovies]);

  res.render('movie', { movie: results });
  console.log(results);
  connection.end();
});

server.get('/movies', async (req, res) => {
  const genreFilterParam = req.query.genre;
  const sortParam = req.query.sort;

  const connection = await getConnection();
  let queryMovies = [];

  if (!genreFilterParam) {
    queryMovies = `SELECT * FROM movies ORDER BY title ${sortParam}`;
  } else {
    queryMovies = `SELECT * FROM movies WHERE genre= ? ORDER BY title ${sortParam}`;
  }

  const [results, fields] = await connection.query(queryMovies, [
    genreFilterParam,
  ]);
  res.json({
    success: true,
    movies: results,
  });

  connection.end();
});
server.post('/favorites-add', async (req, res) => {
  let idMovie = req.body.idMovie;
  let idUser = req.body.idUser;
  let score = req.body.score;

  const favourite = new Favourite({
    users: idUser,
    movies: idMovie,
    score: score
  });

  try {
    const doc = await favourite.save();
    res.json(doc);
  } catch (err) {
    res.json(err);
  }
});
server.get('/favourites-list/:idUser', async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.params.idUser); // Use req.params.idUser
    const favourites = await Favourite.find({ users: userId }).populate('movies');
    console.log('Favourites:', favourites);
    res.json(favourites);
  } catch (error) {
    console.error('Error converting user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






server.post('/sign-up', async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  console.log(req.body);
  const passwordHashed = await bcrypt.hash(password, 10);
  const sql = 'insert into users (user, email, password) values (?,?,?) ';
  const connection = await getConnection();
  const [results] = await connection.query(sql, [
    email,
    email,
    passwordHashed,
    email,
  ]);
  console.log(results);
  connection.end();
  res.json({ success: true, id: results.insertId });
});

server.post('/login', async (req, res) => {
  const userName = req.body.email;
  const password = req.body.password;
  const sql = 'select * from users where user=? ';
  const connection = await getConnection();
  const [users] = await connection.query(sql, [userName]);
  connection.end();
  const user = users[0];
  console.log(userName);
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
    });
  }
  const userForToken = {
    username: user.user,
    id: user.id,
  };
  const token = generateToken(userForToken);

  // const [results]= await connection.query(sql,[userName,passwordHashed]);
  response.status(200).json({ token, username: user.user, name: user.email });
});

const staticServerPath = './web/dist/';
server.use(express.static(staticServerPath));
