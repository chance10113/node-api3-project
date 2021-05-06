const User = require("../users/users-model");

function logger(req, res, next) {
  console.log(`
  ${req.method} request to ${req.baseUrl} endpoint!
  req.body ${JSON.stringify(req.body)}
  req.params.id ${req.params.id}
`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    const userId = await User.getById(req.params.id);
    if (!userId) {
      next({ status: 404, message: `user not found` });
    } else {
      req.userId = userId;
      next();
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    req.status(400).json({
      message: "missing required name field",
    });
  } else {
    req.name = name.trim();
    next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body;
  if (!text || !text.trim()) {
    req.status(400).json({
      message: "missing required text field",
    });
  } else {
    req.text = text.trim();
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = { logger, validateUserId, validateUser, validatePost };
