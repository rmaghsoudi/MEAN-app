const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
            res.status(500).json({
              message: "Invalid Authentication Credentials"
            })
        })
    });
}

exports.userLogin = (req, res, next) => {
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
            token,
            expiresIn: 3600,
        // passing the user id here because parsing the token would reduce performance on the frontend
            userId: fetchedUser._id
          });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Invalid Authentication Credentials"
        })
      });
}
