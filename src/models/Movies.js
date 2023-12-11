const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moviesSchema = new Schema(
  {
    name: String,
    genre: String,
    image: String,
    category: String,
    year: Number,
  },
  { collection: 'movies' }
);
const Movie = mongoose.model('movies', moviesSchema);
module.exports = Movie;
