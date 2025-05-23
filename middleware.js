const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { schema: noteSchema } = require("./noteSchema.js");
const Note = require("./models/note");

module.exports.validateNote = (req, res, next) => {
  const { error } = noteSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    if (req.originalUrl.includes("/notes/new")) {
      req.flash("error", "You must be logged in to create a note!");
    } else if (req.originalUrl.includes("/notes/")) {
      req.flash("error", "You must be logged in to edit or delete a note!");
    } else {
      req.flash("error", "You must be logged in to perform this action!");
    }
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Middleware for Note Ownership Check
module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note || !note.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to access this note.");
    return res.redirect("/notes");
  }
  next();
});
