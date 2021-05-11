var db = require("../database/");

// get all animals
exports.getAnimals = async (req, res) => {
  try {
    var sql = "select * from animals";
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        // return formatted response
        return res.status(400).json({
          error: err.message,
        });
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

//
exports.getAnimalById = async (req, res) => {
  try {
    var sql =
      "select a.id,l.location,a.endangered,a.description,a.location_id,a.image,a.name from animals as a inner join locations as l on a.location_id = l.id where a.id = ?";
    var params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({
          error: err.message,
        });
        return;
      }
      res.status(200).json({
        data: row,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

//
exports.createAnimal = async (req, res) => {
  try {
    var errors = [];
    if (!req.body.name) {
      errors.push("No Name specified");
    }
    if (!req.body.endangered) {
      errors.push("Endangered not specified");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    if (!req.files) {
      return res.status(400).render("create-animal", {
        title: "Create - Create Animal page",
        err: "No files were uploaded.",
      });
    } else {
      var file = req.files.upload;
      var img_name = file.name;
      if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/gif"
      ) {
        file.mv("src/public/img/uploaded_images/" + file.name, function (err) {
          if (err) {
            req.flash("error_msg", err.message);
            return res.status(500).render("create-animal", {
              title: "Create - Create Animal page",
            });
          }
          var data = {
            name: req.body.name,
            description: req.body.description,
            endangered: req.body.endangered,
            location_id: req.body.location,
          };
          var sql =
            "INSERT INTO animals (name,description ,endangered,location_id, image) VALUES (?,?,?,?,?)";
          var params = [
            data.name,
            data.description,
            data.endangered,
            data.location_id,
            img_name,
          ];
          db.run(sql, params, function (err, result) {
            if (err) {
              req.flash("error_msg", err.message);
              res.status(400).render("create-animal", {
                title: "Create - Create Animal page",
              });
              return;
            }
            req.flash("success_msg", "Created Successfully");
            return res.redirect("/animals");
          });
        });
      } else {
        message =
          "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        req.flash("error_msg", message);
        return res.status(400).render("create-animal", {
          title: "Create - Create Animal page",
        });
      }
    }
  } catch (e) {
    req.flash("error_msg", e.message);
    res.status(500).render("create-animal", {
      title: "create - create animal",
    });
  }
};

//
exports.updateAnimalById = async (req, res) => {
  try {
    var data = {
      name: req.body.name,
      description: req.body.description,
      endangered: req.body.endangered,
    };
    db.run(
      `update animals SET name = coalesce(?,name), description = coalesce(?,description), 
         endangered = coalesce(?,endangered) where id = ?`,
      [data.name, data.description, data.endangered, req.params.id],
      function (err, result) {
        if (err) {
          req.flash("error_msg", err.message);
          res.status(400).render("update-animal", {
            title: "Create - Create Animal page",
          });
          return;
        }
        req.flash("success_msg", "Updated Successfully");
        return res.redirect("/animals");
      }
    );
  } catch (e) {
    req.flash("error_msg", e.message);
    res.status(500).render("update-animal", {
      title: "Update - Update animal",
    });
  }
};

//
exports.deleteAnimalById = async (req, res) => {
  try {
    db.run("delete from animals where id = ?", [req.params.id], function (
      err,
      result
    ) {
      if (err) {
        req.flash("error_msg", err.message);
        res.status(400).render("update-animal", {
          title: "Create - Create Animal page",
        });
        return;
      }
      req.flash("success_msg", "Deleted Successfully");
      return res.status(200).json({ message: "successful" });
    });
  } catch (e) {
    req.flash("error_msg", e.message);
    res.status(400).render("update-animal", {
      title: "Create - Create Animal page",
    });
  }
};

exports.getLocation = async (req, res) => {
  try {
    var sql = "select * from locations";
    var params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
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

exports.dropLocationDb = async (req, res) => {
  try {
    var sql = "DROP TABLE IF EXISTS locations";
    var params = [];
    db.all(sql, params, (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      res.status(200).json({
        data: result,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

exports.dropAnimalDb = async (req, res) => {
  try {
    var sql = "DROP TABLE IF EXISTS animals";
    var params = [];
    db.all(sql, params, (err, result) => {
      if (err) {
        return res.status(400).json({
          error: err.message,
        });
      }
      res.status(200).json({
        data: result,
      });
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};
