const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  let navbarSource = req.query.source === "navbar";
  res.render("user/signup.ejs", { navbarSource });
};

module.exports.signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let navbarSource = req.body.source === "navbar";
    const user = new User({ username, email });
    const userRegistered = await User.register(user, password);
    req.login(userRegistered, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registration successful!");
      let redirectUrl = res.locals.redirectUrl || "/notes";
      if (navbarSource) {
        redirectUrl = "/notes";
      }
      res.redirect(redirectUrl);
    });
  } catch (err) {
    if (err.code === 11000 && err.message.includes("username")) {
      req.flash(
        "error",
        "Username is already taken. Please choose a different one."
      );
    } else {
      req.flash("error", err.message);
    }
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  let navbarSource = req.query.source === "navbar";
  res.render("user/login", { navbarSource });
};

module.exports.loginUser = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  let redirectUrl = res.locals.redirectUrl || "/notes";
  let navbarSource = req.body.source === "navbar";
  if (navbarSource) {
    redirectUrl = "/notes";
  }
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been successfully logged out.");
    res.redirect("/");
  });
};
