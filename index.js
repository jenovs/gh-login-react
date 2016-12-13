const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const app = express();

const GithubStrategy = require('passport-github2').Strategy;

const clientID = "ffd10470e3eb457e804c";
const clientSecret = "10a0edf349ea3a70f82abc87bda76a3229ba1199";
const callbackURL = "http://127.0.0.1:3000/auth/github/callback";

if (process.env.NODE_ENV === 'production') {
  const clientID = "bee8d111fc908ee1cbfd";
  const clientSecret = "ef6191e96039c4b492b14e0768edf57abb9694c8";
  const callbackURL = "https://damp-harbor-12298.herokuapp.com/auth/github/callback";
}

passport.use(new GithubStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(401).redirect('/');
  next();
}

app.use(session({
  secret: 'dfkldsjfio84395dsjf9eru',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(express.static('./server/static'));
app.use(express.static('./client/dist'));

// this will start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));

// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/')
  }
);

app.get('/success', ensureAuthenticated, (req, res) => {
  res.send({user: req.user.username});
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
