const Note = require("../models/note");
const ExpressError = require("../utils/ExpressError.js");
module.exports.index = async (req, res) => {
  req.session.redirectUrl = "/notes";
  let allNotes = await Note.find({});
  res.render("note/index.ejs", { allNotes });
};
module.exports.renderNewForm = (req, res) => {
  res.render("note/new.ejs");
};
module.exports.createNote = async (req, res) => {
  const note = new Note(req.body.note);
  note.owner = req.user._id;
  await note.save();
  req.flash("success", "New Note Saved!");
  res.redirect("/notes");
};
module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  if (!note) {
    next(new ExpressError(404, "Note not found!"));
  } else {
    res.render("note/edit.ejs", { note });
  }
};
module.exports.updateNote = async (req, res) => {
  await Note.findByIdAndUpdate(req.params.id, req.body.note);

  req.flash("success", "Note Updated!");
  res.redirect("/notes");
};
module.exports.destroyNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success", "Note successfully deleted!");
  res.redirect("/notes");
};
