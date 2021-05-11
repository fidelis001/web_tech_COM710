const express = require("express"),
  app = express(),
  path = require("path"),
  session = require("express-session"),
  flash = require("connect-flash"),
  passport = require("passport"),
  axios = require("axios"),
  { checkAuthenticated } = require("./middleware/auth"),
  methodOverride = require("method-override"),
  fileUpload = require("express-fileupload"),
  ejs = require("ejs");

const PORT = process.env.PORT || 3002;
var baseURL = "http://localhost:" + PORT;

require("dotenv").config();

app.use(express.static(path.join(__dirname, "public")));

// template's engine
app.set("view engine", "html");
app.engine("html", ejs.renderFile);
app.set("views", __dirname + "/views");

//handles post and put
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Express session middleware
app.use(
  session({
    secret: "secretKey",
    resave: true,
    saveUninitialized: true,
  })
);

// passport config
require("./middleware/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Express message middleware
app.use(flash()); //connect flash

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg"); // resource protection error auth.js
  res.locals.error = req.flash("error"); // login passport.js msg
  next();
});

// setting global variable for every view as middleware function to check whether user is logged in or not
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
app.use(methodOverride("_method"));
// animal route
const animalRoute = require("./routes/animal.route");
app.use("/api", animalRoute);

// user route
const userRoute = require("./routes/user.route");
app.use("/api/auth", userRoute);

// landing page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
  });
});
// logout
app.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "Successfully logged out");
  res.redirect("/");
});

// listing all animals view
app.get("/animals", (req, res) => {
  axios
    .get(`${baseURL}/api/animals`)
    .then((response) => {
      res.render("animals", {
        title: "Animals Page",
        animals: response.data.data,
      });
    })
    .catch((err) => {
      req.flash("error_msg", err.message);
      return res.render("animals", {
        title: "Animals Page",
      });
    });
});

// creating animal
app.get("/create", checkAuthenticated, (req, res) => {
  axios
    .get(`${baseURL}/api/location`)
    .then((response) => {
      return res.render("create-animal", {
        title: "Create - Create Animal page",
        location: response.data.data,
      });
    })
    .catch((err) => {
      req.flash("error_msg", err.message);
      return res.render("create-animal", {
        title: "Create - Create Animal page",
      });
    });
});
// edit animal
//
app.get("/edit/:id", checkAuthenticated, (req, res) => {
  let animal = axios.get(`${baseURL}/api/animals/${req.params.id}/`),
    location = axios.get(`${baseURL}/api/location`);
  Promise.all([animal, location])
    .then((response) => {
      return res.render("update-animal", {
        title: "Update - Update Animal page",
        location: response[1].data.data,
        animal: response[0].data.data,
      });
    })
    .catch((e) => {
      req.flash("error_msg", e.message);
      return res.render("update-animal", {
        title: "Update - Update Animal page",
      });
    });
});

// view animal
app.get("/pets/:id/", (req, res) => {
  let animal = axios.get(`${baseURL}/api/animals/${req.params.id}/`),
    location = axios.get(`${baseURL}/api/location`);
  Promise.all([animal, location])
    .then((response) => {
      res.render("view-animal", {
        title: "View - Animals Page",
        location: response[1].data.data,
        animal: response[0].data.data,
      });
    })
    .catch((e) => {
      req.flash("error_msg", e.message);
      res.render("view-animal", {
        title: "View - Animals Page",
      });
    });
});

// login page
app.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login || Animals Page",
  });
});
app.get("/register", (req, res) => {
  res.render("auth/signup", {
    title: "Register || Animals Page",
  });
});
// 404 error page
app.get("*", function (req, res) {
  res.status(404).render("404", {
    title: "404 Page Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server started http://localhost:${PORT}`);
});
