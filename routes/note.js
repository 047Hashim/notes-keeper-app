const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware");

const { isLoggedIn, isOwner, validateNote } = require("../middleware.js");
const noteController = require("../controllers/note.js");

router
  .route("/")
  .get(wrapAsync(noteController.index))
  .post(isLoggedIn, validateNote, wrapAsync(noteController.createNote));

router.get("/new", isLoggedIn, noteController.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(noteController.renderEditForm)
);

router
  .route("/:id")
  .put(isLoggedIn, isOwner, validateNote, wrapAsync(noteController.updateNote))
  .delete(isLoggedIn, isOwner, wrapAsync(noteController.destroyNote));

module.exports = router;
