const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favouriteSchema = new Schema(
    {
      users: {type: Schema.Types.ObjectId, ref: 'users'},
      movies: {type: Schema.Types.ObjectId, ref: 'movies'},
      score: Number,
    },
    {collection: 'favourite'}
  );
  const Favourite = mongoose.model('favourite', favouriteSchema);
  module.exports = Favourite;
