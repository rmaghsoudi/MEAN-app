// custom middleware to check if user is authorized
const jwt = require('jsonwebtoken');

// middleware is just a function that gets executed on the request
module.exports = (req, res, next) => {
// auth header will have "Bearer: tokenstuff" by convention, hence the split
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'this_secret_should_be_longer');
    // every middleware running after this one will have access to this newly created data field
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    // lets the request travel on after token verification
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth Failed" });
  }
};
