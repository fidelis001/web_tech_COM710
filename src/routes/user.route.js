const router = require("express").Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/auth");

const {
  authenticateUser,
  getUsers,
  registerUser,
} = require("../controllers/user");

// user route
router.post("/users", checkNotAuthenticated, authenticateUser);
router.get("/users", checkAuthenticated, getUsers);
router.post("/users/register", registerUser);

module.exports = router;
