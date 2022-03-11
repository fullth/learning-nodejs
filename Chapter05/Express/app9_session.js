/** 
 * @Date : 2022-03-11 23:08:55
 * @Title : Express
 * @Description : 오류 페이지 제어를 미들웨어를 통해 할 수 있다.
 */


// 기본모듈 불러오기
const express = require('express'); 
const http = require('http');
const path = require('path');

// 미들웨어 불러오기
const bodyParser = require('body-parser');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const logger = require('../../logger');

let app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

let router = express.Router();

router.route('/process/login').post(function(req, res) {
	logger.info('/process/login 호출됨.');

	let paramId = req.body.id || req.query.id;
	let paramPassword = req.body.password || req.query.password;
	
	if (req.session.user) {
		// 이미 로그인된 상태
		logger.info('이미 로그인되어 상품 페이지로 이동합니다.');
		
		res.redirect('/public/product.html');
	} else {
		// 세션 저장
		req.session.user = {
			id: paramId,
			name: 'TH',
			authorized: true
		};
		
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h1>로그인 성공</h1>');
		res.write('<div><p>Param id : ' + paramId + '</p></div>');
		res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
		res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
		res.end();
	}
});

// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res) {
	logger.info('/process/logout 호출됨.');
	
	if (req.session.user) {
		// 로그인된 상태
		logger.info('로그아웃합니다.');
		
		req.session.destroy(function(err) {
			if (err) {throw err;}
			
			logger.info('세션을 삭제하고 로그아웃되었습니다.');
			res.redirect('/public/login2.html');
		});
	} else {
		// 로그인 안된 상태
		logger.info('아직 로그인되어있지 않습니다.');
		
		res.redirect('/public/login2.html');
	}
});

// 상품정보 라우팅 함수
router.route('/process/product').get(function(req, res) {
	logger.info('/process/product 호출됨.');
	
	if (req.session.user) {
		res.redirect('/public/product.html');
	} else {
		res.redirect('/public/login2.html');
	}
});

app.use('/', router);

let errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});