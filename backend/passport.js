const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const isConnected = require('./mongoconnect');
const User = require('./schema/user-model');
const jwt = require('jsonwebtoken');

require('dotenv').config({path:'./config.env'});

const jwtSecret = "secured_hash_begin_coromandel_12841_howrah_to_chennai_end_hash_secured"

passport.use(
  new GoogleStrategy({
      clientID:process.env.SHAKTI_CLIENT_ID,
      clientSecret:process.env.SHAKTI_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/googlesignin',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(isConnected)
      if (!isConnected) {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });
          let user;
          if (!existingUser) {
            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              username: profile.displayName,
              friends: [],
              requests: []
            });
            await user.save();
          } else {
            user = existingUser;
          }
          const token = jwt.sign(
            {id: user.googleId, email: user.email, username: user.username },
            jwtSecret,
            {expiresIn: '5d'}
          );
          user.token=token;
          done(null,user);
        } catch (error) {
          done(error, null,{message:"Unexpected Error OAuth Google Authentication"});
        }
      }
    }

  )
);

passport.serializeUser((user, done) => {
  
});

passport.deserializeUser((id, done) => {
  
});