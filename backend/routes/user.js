const express = require('express');
const bcrypt = require('bcrypt')

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  // function that encrypts the password, the larger the number the more secure it is but the longer it'll take
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
            res.status(201).json({ message: 'User Created!', result})
        })
        .catch(error => {
            res.status(500).json({error})
        })
    });
});

module.exports = router;
