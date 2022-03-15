// Express 기본 모듈 불러오기
let express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
let bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

let expressErrorHandler = require('express-error-handler');
let expressSession = require('express-session');
let passport = require('passport');
let flash = require('connect-flash');
let config = require('./config');
let database = require('./database/database');
let route_loader = require('./routes/route_loader');
let logger = require('../logger');

let app = express();

//===== 뷰 엔진 설정 =====//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
logger.info('뷰 엔진이 ejs로 설정되었습니다.');

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
logger.info('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

app.use(passport.initialize()); // 패스포트 초기화
app.use(passport.session()); // 로그인 세션 유지
app.use(flash());

//라우팅 정보를 읽어들여 라우팅 설정
let router = express.Router();
route_loader.init(app, router);

let configPassport = require('./config/passport');
configPassport(app, passport);

let userPassport = require('./routes/user_passport');
userPassport(app, passport);

//===== 404 에러 페이지 처리 =====//
errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

//===== 서버 시작 =====//
//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	logger.info('uncaughtException 발생함 : ' + err);
	logger.info('서버 프로세스 종료하지 않고 유지함.');
	
	logger.info(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    logger.info("프로세스가 종료됩니다.");
    app.close();
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

app.on('close', function () {
	logger.info("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
let server = http.createServer(app).listen(app.get('port'), function(){
	logger.info('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
});
