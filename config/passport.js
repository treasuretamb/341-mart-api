const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // make sure this exactly matches your Google Console setting:
  callbackURL:  `${process.env.RENDER_URL}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  // Simplified: sign and return a JWT
  const user = {
    googleId:    profile.id,
    email:       profile.emails[0].value,
    displayName: profile.displayName
  };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  return done(null, { user, token });
}));
