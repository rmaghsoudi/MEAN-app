const express = require("express");
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');


const PostsController = require('../controllers/posts');

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

router.post('', checkAuth, multer({storage}).single('image'), PostsController.createPost);

router.get('', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

router.patch(
  "/:id",
  checkAuth,
  multer({storage}).single('image'),
  PostsController.updatePost
  );

// the wildcard is called a dynamic path segment ":"
router.delete('/:id', checkAuth, PostsController.deletePost);

module.exports = router;
