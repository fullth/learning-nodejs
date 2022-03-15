let LocalStrategy = require('passport-local').Strategy;
let logger = require('../../../logger');

module.exports = new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	let paramName = req.body.name || req.query.name;
	logger.info('passport의 local-signup 호출됨: ' + email + ', ' + password + ', ' + paramName);

	process.nextTick(function() {
		let database = req.app.get('database');

		database.UserModel.findOne({'email' : email}, function(err, user) {
			if(err) {
				return done(err);
			}

			if(user) {
				logger.info('기존에 계정이 있음.');

				return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
			} else {
				let user = new database.UserModel({'email' : email, 'password': password, 'name': paramName});

				user.save(function(err) {
					if(err) {throw err;}

					logger.info('사용자 데이터 추가함.');
					return done(null, user);
				})
			}
		})
	});
});