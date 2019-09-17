const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  // protocol returns http or https and get the current host
  const url = `${req.protocol}://${req.get("host")}`
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId
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
  })
  .catch(error => {
    res.status(500).json({ message: "Creating a post failed!"})
  });
}

exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({ message: "Fetching posts failed!" })
    });
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  }).catch(error => {
    res.status(500).json({ message: "Fetching post failed!" })
  });
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get("host")}`
    imagePath = `${url}/images/${req.file.filename}`
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.userData.userId
  });
  //updateOne takes 2 arguments, the id of the element and the new object you want to store
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
  // check if user is authorized and send message based off of result
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update Successful!"});
    } else {
      res.status(401).json({ message: "Not Authorized"});
    }
  })
  .catch(error => {
    res.status(500).json({ message: "Couldn't update post!" })
  });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Post Deleted!"});
    } else {
      res.status(401).json({ message: "Not Authorized"});
    }
  }).catch(error => {
    res.status(500).json({ message: "Deleting post failed!" })
  });
}
