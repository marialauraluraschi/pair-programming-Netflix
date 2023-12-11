const mongoose = require('mongoose');

const dbConnect = () => {
  const user = 'barbarabravoredondo';
  const pass = 'jvUpu1ROokqwO5L1';
  const dbName = 'netflix';
  const uri = `mongodb+srv://${user}:${pass}@cluster0.sypmmze.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('conectado a MongoDB'))
    .catch((e) => console.log('error de conexión', e));
};
module.exports = dbConnect;
