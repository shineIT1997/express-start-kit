/**
* File name: passport.js
* Created by Visual studio code
* User: Danh Le / danh.danh20051995@gmail.com
* Date: 2019-01-18 17:37:46
*/
/**
*Module dependencies
*/
import passport from 'passport'
import mongoose from 'mongoose'
import { Strategy as LocalStrategy } from 'passport-local'
const User = mongoose.model('User')
// const config = global.CONFIG

/**
*Configuration and Settings
*/
passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser(async (_id, done) => {
  try {
    let user = await User.findOne({ _id })
    return done(null, user)
  } catch (error) {
    console.error('There was an error accessing the records of user with id: ' + _id)
    return console.log(error)
  }
})

/**
*Strategies
*/
/* ---------------------------Local Strategy------------------------------------- */
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  process.nextTick(async () => {
    try {
      let user = await User.findOne({ email })
      if (user) {
        console.log('user already exists')
        return done(null, false, { errMsg: 'email already exists' })
      }

      let newUser = new User()
      newUser.email = email
      newUser.username = req.body.username
      newUser.password = newUser.generateHash(password)
      await newUser.save()

      console.log('New user successfully created...', newUser.username)
      console.log('email', email)
      console.log(newUser)
      return done(null, newUser)
    } catch (error) {
      // return done(null, false, { errMsg: 'Please fill all fields' })
      return console.log(error)
    }
  })
}))

/* ---------------------------local login---------------------------------------- */
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  let user = await User.findOne({ email })
  if (!user) {
    return done(null, false, { errMsg: 'User does not exist, please <a class="errMsg" href="/signup">signup</a>' })
  }
  if (!user.validPassword(password)) {
    return done(null, false, { errMsg: 'Invalid password try again' })
  }
  return done(null, user)
}))

/**
*Export Module
*/
module.exports = passport
export default passport
