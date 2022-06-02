// https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
// https://www.loginradius.com/blog/engineering/google-authentication-with-nodejs-and-passportjs/
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();

const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const session = require("express-session")
var cookieParser = require("cookie-parser")




app.use(
  session({
    secret: process.env.DEV_USER_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {httpOnly:false},

  })
);


app.use(cookieParser(process.env.DEV_USER_SECRET))

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 8001);

User = require("./models/user-model");
app.use(bodyParser.urlencoded({ extended: true }));




app.listen(app.get("port"), () => {
    console.log(`✅ PORT: ${app.get("port")} 🌟`);
  });
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(function (user, cb) {
  cb(null, user);
 });

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
/*
const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
*/

function checkAuthentication(req, res, next) {
  console.log(req.user)
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

// app.use("/login", loginlimiter);


app.get("/register", (req, res) => {
  res.send("register page");
});

app.get("/login", function (req, res) {
  res.send("login page");
});

app.get("/user", function (req, res) {
  res.send(req.user);
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register"
  }),
  function (req, res) {
  }
);

app.get("/checkAuthentication", (req, res) => {
  const authenticated =  req.isAuthenticated()

  res.status(200).json({
    authenticated,
  });
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.send("It worked for Google!");
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
        return res.send("confirmation"
        );
      }

      passport.authenticate("local")(req, res, function () {
        res.send("login page");
      });
    }
  );
});

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

app.get("/confirmation", function (req, res) {
  res.send("confirmation page");
});

app.get("/forgot", function (req, res) {
  res.send("forgot page");
});


app.get("/reset", function (req, res) {
  res.send("reset page");
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
            subject: "Password Reset",
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

const dayController = require("./controllers/dayController");
app.use("/", checkAuthentication, dayController);