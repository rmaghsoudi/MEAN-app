const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS")
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts Fetched Successfully!',
        posts: documents
      });
    });

});

module.exports = app;
