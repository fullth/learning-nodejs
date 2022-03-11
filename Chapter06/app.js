/** 
 * @Date : 2022-03-12 01:15:06
 * @Title : 몽고디비
 * @Description : 익스프레스에서 몽고디비 사용하기, users2 생성전까지(~p236)는 현재 소스안에서 작성함.
 * @Memo : database 변수를 초기화 해주는 부분에서 몽고디비 버전 3.0 이상부터는 database명을 명시해야 함.
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
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { data } = require('../logger');

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
	
	// 데이터베이스 연결
	// MongoClient.connect(databaseUrl, function(err, db) {
	// 	if (err) throw err;
		
	// 	logger.info('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
	// 	database = db.db('local'); // 3.0 이상부터는 database명을 명시해야 함.
	// });

    // 몽구스를 이용한 디비 연결
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error'));
    database.on('open', function() {
    	logger.info('DB에 연결되었습니다.');

        UserSchema = mongoose.Schema({
            id: String,
            name: String,
            password: String
        });
    	logger.info('스키마가 정의되었습니다.');

        UserModel = mongoose.model('users', UserSchema);
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

router.route('/process/adduser').post(function(req, res) {
	logger.info('/process/adduser 호출.');

    let paramId = req.body.id || req.query.id;
	let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;

    if (database) {
		addUser(database, paramId, paramPassword, paramName, function(err, result) {
			if (err) {throw err;}

            if(result && result.insertedCount > 0) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>추가 성공</h2>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>추가 실패</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

app.use('/', router);

// 사용자를 인증하는 함수
let authUser = function(database, id, password, callback) {
	logger.info('authUser 호출 : ' + id + ', ' + password);
	
    // users 컬렉션 참조
	//let users = database.collection('users');

    // 아이디와 비밀번호를 이용해 검색
	// users.find({"id":id, "password":password}).toArray(function(err, docs) {
	// 	if (err) { // 에러 발생 시 콜백 함수를 호출하면서 에러 객체 전달
	// 		callback(err, null);
	// 		return;
	// 	}
		
	//     if (docs.length > 0) {  // 조회한 레코드가 있는 경우 콜백 함수를 호출하면서 조회 결과 전달
	//     	logger.info('일치하는 사용자 찾음. id : ' + id);
	//     	callback(null, docs);
	//     } else {  // 조회한 레코드가 없는 경우 콜백 함수를 호출하면서 null, null 전달
	//     	logger.info("일치하는 사용자를 찾지 못함.");
	//     	callback(null, null);
	//     }
	// });

    UserModel.find({"id": id, "password": password}, function(err, results) {
        if (err) {
          callback(err, null);
          return;
		}
        if (results.length > 0) {  
            logger.info('일치하는 사용자 찾음. id : ' + id);
            callback(null, results);
        } else { 
            logger.info("일치하는 사용자를 찾지 못함.");
            callback(null, null);
        }
    });
}

let addUser = function(database, id, password, name, callback) {
	logger.info('addUser 호출 : ' + id + ', ' + password + ', ' + name);

	//let users = database.collection('users');
    let users = new UserModel({"id": id, "password": password, "name": name});

    // users.insertMany([{"id" : id, "password" : password, "name" : name}], function(err, result) {
    //     if(err) {
    //         callback(err, null);
    //         return;
    //     }

    //     if(result.insertedCount > 0) {
	//         logger.info('사용자 레코드 추가됨: ' + result.insertedCount);
    //     } else {
	//         logger.info('추가된 레코드 없음.');
    //     }

    //     callback(null, result);
    // });

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