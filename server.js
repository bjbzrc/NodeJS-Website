if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const usrs = [];

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "my_database",
});

const createPassport = require("./passportConfig");
createPassport(
  passport,
  (email) => usrs.find((user) => user.email === email),
  (id) => usrs.find((user) => user.id === id)
);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ exteded: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", checkAuthenticated, (req, res) => {
  pool.query('SELECT * FROM employees, locations;', (err, rows) => {
    if (err) throw console.error("ERROR");

    if (!err) {
      console.log(rows.length)
      res.render("index.ejs", { rows });
    }
  });
});

app.get('/', function(reg, res) {
  pool.query('SELECT * FROM employees, locations;', (err, rows) => {
      if (err) throw console.error("ERROR");
  
      if (!err) {
          console.log(rows.length)
          res.render('index.ejs', {rows})
      }
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    usrs.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(usrs);
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.use(express.static("public"));
app.use("/js", express.static(__dirname + "public/JS"));
app.use("/css", express.static(__dirname + "Public/CSS"));
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
