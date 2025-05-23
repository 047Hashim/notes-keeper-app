const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user.js");

//singup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(saveRedirectUrl, wrapAsync(userController.signupUser));
//login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid email or password",
    }),
    userController.loginUser
  );

router.get("/logout", userController.logoutUser);

module.exports = router;
