let local_login = require('./passport/local_login');
let local_signup = require('./passport/local_signup');
let google = require('./passport/google')
let logger = require('../../logger');

module.exports = function(app, passport) {
    logger.info('config/passport 호출됨');

    passport.serializeUser(function(user, done) {
        logger.info('serializeUser() 호출됨');
        console.dir(user);
        
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        logger.info('deserializeUser() 호출됨');
        console.dir(user);
        
        done(null, user);
    });

    passport.use('local-login', local_login);
    passport.use('local-signup', local_signup);
    passport.use('google', google(app, passport));
}