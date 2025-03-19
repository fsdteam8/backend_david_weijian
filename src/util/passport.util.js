import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {Auth} from "../model/auth.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Auth.findOne({ googleId: profile.id });

        if (!user) {
          user = new Auth({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            who: "user",
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Auth.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
