import { query } from '../models/appModel';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import 'dotenv/config';

function googleOAuth(passport) {
  // passport.serializeUser((user, cb) => {
  //   // console.log('serializeUser', user);
  //   cb(null, user);
  // });

  // passport.deserializeUser((user, cb) => {
  //   // console.log('deserializeUser', user);
  //   cb(null, user);
  // });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_WEB_CLIENT_ID,
        clientSecret: process.env.GOOGLE_WEB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3333/oauth2/redirect/google', // endpoint '/oauth2/redirect/google' processes the authentication response and logs the user in, after Google redirects the user back to the app
        scope: ['email', 'profile'],
        state: true,
      },
      async function verify(accessToken, refreshToken, profile, cb) {
        try {
          console.log('PROFILE --->', profile);
          console.log('EMAIL --->', profile._json.email);
          // if the Google account has logged in to the app before, should find the user's record in DB
          // const param1 = profile._json.email;
          const param1 = [profile.emails[0].value];
          const query1 = 'SELECT * FROM users WHERE email = $1';
          let result = await query(query1, param1);
          let user = result.rows[0];
          console.log('USER --->', user);
          // if the Google account has not logged in to the app before, create new user record in DB
          // if (!user) {
          if (result.rowCount === 0) {
            // try {
            user = await query(
              'INSERT INTO users (email, password, account_type) VALUES ($1,$2, $3) RETURNING *',
              [profile._json.email, '', '']
            );
            // return once user is created
            return cb(null, profile);
            // } catch (error) {
            //   return cb(error);
            // }
          }
          // return once user is found
          return cb(null, profile);
        } catch (error) {
          return cb(`PASSPORT error: ${error}`);
        }
      }
    )
  );
}

export default googleOAuth;
