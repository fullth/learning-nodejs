let LocalStrategy = require('passport-local').Strategy;
let logger = require('../../../logger');

module.exports = new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	logger.info('passport의 local-loging호출됨: ' + email + ', ' + password);

	let database = req.app.get('database');
	database.UserModel.findOne({ 'email' :  email }, function(err, user) {
		if (err) { return done(err); }

		// 등록된 사용자가 없는 경우
		if (!user) {
			logger.info('계정이 일치하지 않음.');
			return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
		}
		
		// 비밀번호 비교하여 맞지 않는 경우
		let authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
		if (!authenticated) {
			logger.info('비밀번호 일치하지 않음.');
			return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
		} 
		
		// 정상인 경우
		logger.info('계정과 비밀번호가 일치함.');
		return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
	});
});