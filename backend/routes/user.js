const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "No User Found"
        });
      }
     fetchedUser = user;
     return bcrypt.compare(req.body.password, user.password)
    })
      .then(result => {
        console.log(result)
        if (!result) {
          return res.status(401).json({
            message: "Incorrect Password"
          })
        }
        // creates a new token based on input data, a secret, and additional token options
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          'this_secret_should_be_longer',
          {expiresIn: '1h'}
          );
          res.status(200).json({
            token
          });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Auth Failed"
        })
      });
})

module.exports = router;
