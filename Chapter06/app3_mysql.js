/** 
 * @Date : 2022-03-12 03:03:31
 * @Title : MySQL
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

const mysql = require('mysql');

let pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: '000000',
	database: 'test',
	debug: false
})

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

let router = express.Router();

// 로그인 처리 함수
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출됨.');

	// 요청 파라미터 확인
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
	
    // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (pool) {
		authUser(paramId, paramPassword, function(err, rows) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 로그인 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 조회된 레코드가 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);

                // 조회 결과에서 사용자 이름 확인
				let username = rows[0].name;
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();
			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
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

// 로그인 처리 함수
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출됨.');

	// 요청 파라미터 확인
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
	
    // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (pool) {
		authUser(paramId, paramPassword, function(err, rows) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 로그인 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 조회된 레코드가 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);

                // 조회 결과에서 사용자 이름 확인
				let username = rows[0].name;
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
				res.end();
			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login2.html'>다시 로그인하기</a>");
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

// 사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req, res) {
	logger.info('/process/adduser 호출됨.');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;
    let paramAge = req.body.age || req.query.age;
	
    logger.info(`요청 파라미터 : ${paramId}, ${paramPassword}, ${paramName}, ${paramAge}`);
    
    // pool 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (pool) {
		addUser(paramId, paramName, paramAge, paramPassword, function(err, addedUser) {
			// 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
			if (err) {
                logger.error(`사용자 추가 중 에러 발생 : ${err.stack}`);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 중 에러 발생</h2>');
                res.write(`<p> ${err.stack} </p>`);
				res.end();
                
                return;
            }
			
            // 결과 객체 있으면 성공 응답 전송
			if (addedUser) {
				console.dir(addedUser);

				logger.info(`inserted ${result.affectedRows} ${rows}`);
	        	
	        	let insertId = result.insertId;
	        	logger.info(`추가한 레코드의 아이디 : ${insertId}`);
	        	
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 성공</h2>');
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가  실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
});

app.use('/', router);

// 사용자를 인증하는 함수
let authUser = function(id, password, callback) {
	logger.info('authUser 호출됨 : ' + id + ', ' + password);
	
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }   
          
        let columns = ['id', 'name', 'age'];
        let tablename = 'users';
 
        // SQL 문을 실행합니다.
        let exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release();  // 반드시 해제해야 함
            logger.info(`실행 대상 SQL : ${exec.sql}`);
            
            if (rows.length > 0) {
    	    	callback(null, rows);
            } else {
            	logger.info("일치하는 사용자를 찾지 못함.");
    	    	callback(null, null);
            }
        });

        conn.on('error', function(err) {      
            logger.info('데이터베이스 연결 시 에러 발생함.');
            
            callback(err, null);
      });
    });
	
}

let addUser = function(id, name, age, password, callback) {
	logger.info('addUser 호출 : ' + id + ', ' + password + ', ' + name);

	pool.getConnection(function(err, conn) {
		if(err) {
			if(conn) {
				conn.release();
			}

			callback(err, null);
			return;
		}

		let data = {id: id, name: name, age: age, password: password};

		let exec = conn.query('insert into users set ?', data, function(err, result) {
			conn.release();
			logger.info('실행 대상 SQL: ' + exec.sql);

			if(err) {
				console.error('SQL 실행 중 오류 발생');
				callback(err, null);

				return;
			}

			callback(null, result);
		});
	});
}

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

process.on('SIGTERM', function () {
    logger.info("프로세스가 종료됩니다.");
});

app.on('close', function () {
	logger.info("Express 서버 객체가 종료됩니다.");
});

// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  logger.info(`서버가 시작되었습니다. 포트 : ${app.get('port')}`);
});
 