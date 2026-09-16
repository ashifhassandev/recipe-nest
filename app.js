require("dotenv").config();

const connectToDatabase = require("./config/dbConfig");
connectToDatabase();

const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const nocache = require("nocache");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const expressLayouts = require("express-ejs-layouts");
const { cleanupExpiredOtps } = require("./utils/otpUtils");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production"
     },
  }),
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(nocache());
app.use(flash());
app.use(methodOverride("_method"));

app.use(
  cors({
    origin: "https://recipe-nest-b24f.onrender.com",
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});

app.use((req, res, next) => {
  const token = req.cookies.authToken;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.locals.isLoggedIn = true;
      res.locals.username = `${decoded.firstName} ${decoded.lastName}`.trim();
    } catch (error) {
      console.error("Invalid token:", error.message);

      res.locals.isLoggedIn = false;
      res.locals.username = null;
    }
  } else {
    res.locals.isLoggedIn = false;
    res.locals.username = null;
  }
  next();
});

const indexRoutes = require("./routes/indexRoutes");
const userRoutes = require("./routes/userRoutes");
const otpRoutes = require("./routes/otpRoutes");

app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/otp", otpRoutes);

app.use((req, res, next) => {
  const locals = { title: "404 | Page Not Found" };
  res.status(404).render("404", {
    locals,
    layout: "layouts/errorLayout",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  const locals = { title: "500 | Internal Server Error" };
  res.status(500).render("serverError", {
    locals,
    layout: "layouts/errorLayout",
  });
});

cleanupExpiredOtps();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;