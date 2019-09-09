const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");

const app = express();
//returns a promise, hence we can use the .thens, you should account for the failures, the "test" is the db name
mongoose.connect("mongodb+srv://romy:kWqc6ftWcBx3kv3v@cluster0-iq6jj.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true})
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(() => {
    console.log("DB connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// make the images folder statically accessible by using the express static middleware
// using the path import, any requests to images will be forwarded to the correct folder
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
});

// defining the route that'll use your imported routes
app.use("/api/posts", postsRoutes);

module.exports = app;
