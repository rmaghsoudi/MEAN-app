const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type")
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`)
  }
})

router.post('', checkAuth, multer({storage}).single('image'), (req, res, next) => {
  // protocol returns http or https and get the current host
  const url = `${req.protocol}://${req.get("host")}`
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        // use of the spread operator here saves a complex mongoose object but doesn't cause errors because they're not used
        id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath
      }
    });
  });

});

router.get('', (req, res, next) => {
  // + is a shorthand for converting strings to numbers
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    // determines how many documents should be skipped
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  // queries based on the new "skipped" value
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  })

});

router.patch(
  "/:id",
  checkAuth,
  multer({storage}).single('image'),
  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get("host")}`
    imagePath = `${url}/images/${req.file.filename}`
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath
  });
  //updateOne takes 2 arguments, the id of the element and the new object you want to store
  Post.updateOne({ _id: req.params.id}, post).then(result => {
    res.status(200).json({ message: "Update Successful!"});
  });
});

// the wildcard is called a dynamic path segment ":"
router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "Post Deleted!"});
  })
});

module.exports = router;
