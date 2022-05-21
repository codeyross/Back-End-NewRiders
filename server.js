// https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
// https://www.loginradius.com/blog/engineering/google-authentication-with-nodejs-and-passportjs/
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();

const mongoose = require("mongoose");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
// const rateLimit = require("express-rate-limit");
// const nodemailer = require("nodemailer");



/*
app.use(
  require("express-session")({
    secret: process.env.DEV_USER_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
*/
app.use(cors());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 8001);

// User = require("./models/user-model");
app.use(bodyParser.urlencoded({ extended: true }));


const dayController = require("./controllers/dayController");
app.use("/:day", dayController);

app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
  });
  
  app.get("/", (req, res) => {
   // res.redirect("/login");
   res.send("Hello")
  });






// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(function (user, cb) {
//  cb(null, user);
// });
/*
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SEC;

var userProfile;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);
*/
/*
const customerController = require("./controllers/customerController.js");
app.use("/customers", checkAuthentication, customerController);
*/
/*
const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.use("/login", loginlimiter);
*/




/*
app.get("/register", (req, res) => {
  res.render("register", { layout: "register" });
});

app.get("/login", function (req, res) {
  res.render("login", { layout: "login" });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/customers",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/customers");
  }
);

app.post("/register", function (req, res) {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  User.register(
    new User({ username: username, email: email }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("confirmation", {
          layout: "confirmation",
          message: err,
        });
      }

      passport.authenticate("local")(req, res, function () {
        res.render("login", { layout: "login" });
      });
    }
  );
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/confirmation", function (req, res) {
  res.render("confirmation", { layout: "confirmation" });
});

app.get("/forgot", function (req, res) {
  res.render("forgot", { layout: "forgot" });
});

app.get("/reset", function (req, res) {
  res.render("reset", { layout: "reset" });
});

// source https://stackoverflow.com/questions/1497481/javascript-password-generator
function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

app.post("/forgot", function (req, res) {
  User.findByUsername(req.body.username).then(
    function (sanitizedUser) {
      if (sanitizedUser) {
        let temp = generatePassword();
        sanitizedUser.setPassword(temp, function () {
          sanitizedUser.save();

          let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.DEV_EMAIL,
                pass: process.env.DEV_PASSWORD,
            }
        });

          var mailOptions = {
            from: process.env.DEV_EMAIL,
            to: sanitizedUser.email,
            subject: "CRM Password Reset",
            text: `Temp password: ${temp}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          res.render("confirmation", {
            layout: "confirmation",
            message: "Temporary Password Sent",
          });
        });
      } else {
        res.render("confirmation", {
          layout: "confirmation",
          message: "This user does not exist!",
        });
      }
    },
    function (err) {
      console.error(err);
    }
  );
});

app.post("/reset", function (req, res) {
  User.findByUsername(req.body.username).then(
    function (sanitizedUser) {
      if (sanitizedUser) {
        sanitizedUser.changePassword(
          req.body.oldpassword,
          req.body.newpassword,
          function () {
            sanitizedUser.save();

            res.render("confirmation", {
              layout: "confirmation",
              message: "Password Reset!",
            });
          }
        );
      } else {
        res.render("confirmation", {
          layout: "confirmation",
          message: "This user does not exist!",
        });
      }
    },
    function (err) {
      console.error(err);
    }
  );
});

*/