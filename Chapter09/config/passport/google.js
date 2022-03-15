let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let config = require('../../config');
let logger = require('../../../logger');

module.exports = function(app, passport) {
    return new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
    }, function(accessToken, refreshToken, profile, done) {
        logger.info('passport의 google 호출됨.');
		console.dir(profile);
		
		let options = {
		    'google': {'google': profile.id }
		};
		
		let database = app.get('database');
	    database.UserModel.findOne(options, function (err, user) {
			if (err) {
                return done(err);
            }

			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
			        email: profile.emails[0].value,
			        provider: 'google',
			        google: profile._json
				});
        
				user.save(function (err) {
					if (err) console.log(err);
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
	    });
    })
}