const express = require("express");

// You will need `users-model.js` and `posts-model.js` both
const User = require("./users-model");
const Post = require("../posts/posts-model");
// The middleware functions also need to be required
const {
  logger,
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const router = express.Router();

// RETURN AN ARRAY WITH ALL THE USERS
router.get("/", logger, (req, res, next) => {
  User.get()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

// RETURN THE USER OBJECT
router.get("/:id", logger, validateUserId, (req, res) => {
  res.json(req.user);
});

// RETURN THE NEWLY CREATED USER OBJECT
router.post("/", logger, validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

// RETURN THE FRESHLY UPDATED USER OBJECT
router.put("/:id", logger, validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
    .then(() => {
      return User.getById(req.params.id);
    })
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

// RETURN THE FRESHLY DELETED USER OBJECT
router.delete("/:id", logger, validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

// RETURN THE ARRAY OF USER POSTS
router.get("/:id/posts", logger, validateUserId, async (req, res, next) => {
  try {
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// RETURN THE NEWLY CREATED USER POST
router.post(
  "/:id/posts",
  logger,
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const result = await Post.insert({
        user_id: req.params.id,
        text: req.text,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ERROR STATE
router.use((err, req, res, next) => {   // eslint-disable-line
  res.status(err.status || 500).json({
    note: "something nasty went down in users router",
    message: err.message,
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
