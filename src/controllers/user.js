var db = require("../database");
const bcrypt = require("bcrypt");
const passport = require("passport");

//Authenticate user
exports.authenticateUser = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/animals",
    failureRedirect: "/login",
    failureFlash: true, // show failure msg using message : error
  })(req, res, next);
};

exports.registerUser = async (req, res) => {
  try {
    var errors = [];
    if (!req.body.password) {
      errors.push("Password not specified, Password must be 8 ");
    }
    if (!req.body.email) {
      errors.push("Email is Required");
    }
    if (errors.length) {
      req.flash("error_msg", errors.join(","));
      return res.status(400).render("auth/signup", {
        title: "Register -  Animal page",
      });
    }
    const password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        var user = {
          email: req.body.email,
          password: hash,
        };
        var sql = "INSERT INTO users ( email,password) VALUES (?,?)";
        var params = [user.email, user.password];
        db.run(sql, params, function (err, result) {
          if (err) {
            req.flash("error_msg", err.message);
            return res.status(400).render("auth/signup", {
              title: "Register -  Animal page",
            });
          }
          res.redirect("/login");
        });
      });
    });
  } catch (e) {
    req.flash("error_msg", err.message);
    return res.status(400).render("auth/signup", {
      title: "Register -  Animal page",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    var sql = "select * from users";
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({
          error: err.message,
        });
        return;
      }
      res.status(200).json({
        data: rows,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};
