const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const app = express();
app.use(express.json());
const cors=require("cors");
app.use(cors());

//==============Connection =========================

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is Connected..")
  }).catch(err => {
    console.log(err.message);
  })

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Database connected!');
});

//================ Routes ==========================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/note'));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
