/** 
 * @Date : 2022-03-12 03:03:31
 * @Title : 몽고디비
 * @Description : 
 */


// 기본모듈
const express = require('express')
	, http = require('http')
	, path = require('path');

// Express 미들웨어
const bodyParser = require('body-parser')
	, static = require('serve-static')
	, cookieParser = require('cookie-parser')
	, errorHandler = require('errorhandler')

// 오류 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler')

// Session 미들웨어
const expressSession = require('express-session');
const logger = require('../logger');

// 몽고디비 모듈 사용
const mongoose = require('mongoose');

// 필요한 모듈들을 불러들인 후 아래 메소드를 호출해서 서버 객체를 만듬.
let app = express();

// 기본 속성 지정
app.set('port', process.env.PORT || 3000);

// body-parser를 이용해서 파싱
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
	secret:'my key',
	resave: true,
	saveUninitialized: true
}));

// 데이터베이스 객체를 위한 변수 선언
let database;
let UserSchema;
let UserModel;

//데이터베이스에 연결
function connectDB() {
	let databaseUrl = 'mongodb://localhost:27017/local';
	
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function() {
    	logger.info('DB에 연결되었습니다.');

        UserSchema = require('./schema_모듈분리').createSchema(mongoose);

		UserSchema.static('findById', function(id, callback) {
			return this.find({id: id}, callback);
		});

		UserSchema.static('findAll', function(callback) {
			return this.find({ }, callback);
		})

    	logger.info('스키마가 정의되었습니다.');

        UserModel = mongoose.model('users2', UserSchema);
    	logger.info('모델이 정의되었습니다.');
    });

    database.on('disconnected', function() {
    	logger.info('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}

let router = express.Router();

// 로그인 라우트
router.route('/process/login').post(function(req, res) {
	logger.info('/process/login 호출.');

	let paramId = req.body.id || req.query.id;
	let paramPassword = req.body.password || req.query.password;
	
	if (database) {
		authUser(database, paramId, paramPassword, function(err, docs) {
			if (err) {throw err;}
			
            // 조회된 레코드가 있으면 성공 응답 전송
			if (docs) {
				console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
				let username = docs[0].name;
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}
});

router.route('/process/listuser').post(function(req, res) {
	logger.info('/process/listuser 호출.');

    if (database) {
		UserModel.findAll(function(err, results) {
			if(err) {
				logger.error(err.stack);
				return;
			}

			if(results) {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 리스트 조회</h2>');
				res.write('<div><ul>');

				for(let i = 0; i < results.length; i++) {
					let curId = results[i]._doc.id;
					let curName = results[i]._doc.name;
					res.write('<li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
				}
				res.write('</ul></div>');
				res.end();
			}
		})
	}
});

app.use('/', router);

// 사용자를 인증하는 함수
let authUser = function(database, id, password, callback) {
	logger.info('authUser 호출 : ' + id + ', ' + password);
	
    UserModel.findById(id, function(err, results) {
        if (err) {
          callback(err, null);
          return;
		}
        if (results.length > 0) {  
            logger.info('일치하는 사용자 찾음. id : ' + id);

			if(results[0]._doc.password === password) {
				logger.info('비밀번호 일치함');
				callback(null, results);
			} else {
				logger.error('비밀번호 일치하지 않음');
				callback(null, null);
			}

        } else { 
            logger.info("일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }
    });
}

let addUser = function(database, id, password, name, callback) {
	logger.info('addUser 호출 : ' + id + ', ' + password + ', ' + name);

    let users = new UserModel({"id": id, "password": password, "name": name});

    users.save(function(err) {
        if(err) {
            callback(err, null);
            return;
        }
        logger.info('사용자 레코드 추가됨.');
        callback(null, users);
    });
}

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');

    connectDB();
});