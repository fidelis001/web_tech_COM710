const path = require("path");
var sqlite3 = require("sqlite3").verbose();
var axios = require("axios");

// connect db
const db_name = path.resolve(process.cwd(), "src", "store/database.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }

  console.log("Successful connection to the database 'database.db'");

  db.run(
    ` CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email text UNIQUE,
          password text,
          created_at text DEFAULT CURRENT_TIMESTAMP ,
          CONSTRAINT email_unique UNIQUE (email)

          )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("user table created");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS locations (
      id INTEGER primary key AUTOINCREMENT,
      location text
      )`,
    (err) => {
      if (err) {
        console.log("location table create");
      } else {
        db.get(`SELECT COUNT(location) from locations`, (err, count) => {
          if (!err && count["COUNT(location)"] === 0) {
            var sql = "INSERT INTO locations (location) VALUES (?)";
            axios
              .get("https://countriesnow.space/api/v0.1/countries/")
              .then((res) => {
                console.log(
                  `wait till inserted count is ${res.data.data.length}`
                );
                res.data.data.map(({ country }) => {
                  db.run(sql, [country], (err, row) => {
                    if (err) {
                      console.log(err.message);
                    }
                  });
                });
              });
          }
        });
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS animals (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name text,
          description text,
          endangered boolean,
          image text,
          location_id ,
          FOREIGN KEY(location_id) REFERENCES location(id)
          ON DELETE CASCADE
          )`,
    (err) => {
      if (err) {
        // Table already created
        console.log("animal table created");
      }
    }
  );
});

module.exports = db;
