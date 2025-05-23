if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const notes = require("./routes/note.js");
const users = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/test";
const secretValue = process.env.SECRET || "mysecret_value";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: secretValue,
  },
  touchAfter: 24 * 60 * 60,
  ttl: 7 * 24 * 60 * 60,
});
store.on("error", (err) => {
  console.error("ERROR in Mongo session store:", err);
});
const sessionOptions = {
  store,
  secret: secretValue,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    User.authenticate()
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.url = req.originalUrl;
  next();
});

app.get("/", (req, res) => {
  if (!res.locals.currUser) {
    return res.render("note/home.ejs");
  } else {
    res.redirect("/notes");
  }
});

app.use("/notes", notes);

app.use("/", users);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening to port: 8080");
});
