const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
     'Origin, X-Requested-With, Accpet');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS")
  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: "kjsadbfn24nj",
      title: "first server side post",
      content: "my neme server"
    },
    {
      id: "rhqwj312k",
      title: "second server side post",
      content: "my neme json"
    },
  ];
  res.status(200).json({
    message: 'Posts Fetched Successfully!',
    posts: posts
  });
});

module.exports = app;
