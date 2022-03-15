let logger = require('../../logger');

module.exports = function(router, passport) {
    logger.info('user_passport 호출됨');

    router.route('/').get(function(req, res) {
        logger.info('/ 패스 요청됨');
        res.render('index.ejs');
    });
    
    router.route('/login').get(function(req, res) {
        logger.info('/login 패스 요청됨.');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
    
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    router.route('/logout').get(function(req, res) {
        logger.info('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });
    
    router.route('/signup').get(function(req, res) {
        logger.info('/signup 패스 요청됨.');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    router.route('/auth/google').get(passport.authenticate('google', {
        scope: 'email'
    }));
    
    router.route('/auth/google/callback').get(passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    // 프로필 화면 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 실행
    router.route('/profile').get(function(req, res) {
        logger.info('/profile 패스 요청됨');

        logger.info('req.user의 값');
        console.dir(req.user);

        if(!req.user) {
            logger.info('사용자 인증이 안 된 상태임');
            res.redirect('/');
            return;
        }

        logger.info('사용자 인증된 상태임.')
        if(Array.isArray(req.user)) {
            res.render('profile.ejs', {user: req.user[0]._doc});
        } else {
            res.render('profile.ejs', {user: req.user});
        }
        res.render('index.ejs');
    });
}