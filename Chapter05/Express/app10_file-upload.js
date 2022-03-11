/** 
 * @Date : 2022-03-11 23:57:32
 * @Title : Express
 * @Description : 파일 업로드 기능 만들기
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

// Session 미들웨어
const expressSession = require('express-session');

// 파일 업로드용 미들웨어
const multer = require('multer');
const fs = require('fs');

// ajax 요청 시 CORS 지원
const cors = require('cors');

// 오류 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler')

// 로그 모듈 사용
const logger = require('../../logger');

let app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

app.use(expressSession({
	secret:'my key',
	resave: true,
	saveUninitialized: true
}));

app.use(cors());

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

let upload = multer({ 
    storage: storage,
    limits: {
		files: 10, // 갯수
		fileSize: 1024 * 1024 * 1024 // 10G
	}
});

let router = express.Router();

// 업로드한 사진 파일을 받아서 처리
router.route('/process/photo').post(upload.array('photo', 1), function(req, res) {
	logger.info('/process/photo 호출됨.');
	
	try {
		let files = req.files;
		
		console.dir(req.files[0])
        
		// 현재의 파일 정보를 저장할 변수 선언
		let originalname = '',
			filename = '',
			mimetype = '',
			size = 0;
		
		if (Array.isArray(files)) {
	        logger.info("배열에 들어있는 파일 갯수 : %d", files.length);
	        
	        for (let index = 0; index < files.length; index++) {
	        	originalname = files[index].originalname;
	        	filename = files[index].filename;
	        	mimetype = files[index].mimetype;
	        	size = files[index].size;
	        }
	        
	    }
		
		logger.info('현재 파일 정보 : ' + originalname + ', ' + filename + ', '
				+ mimetype + ', ' + size);
		
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h3>파일 업로드 성공</h3>');
		res.write('<hr/>');
		res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
		res.write('<p>MIME TYPE : ' + mimetype + '</p>');
		res.write('<p>파일 크기 : ' + size + '</p>');
		res.end();
		
	} catch(err) {
		console.dir(err.stack);
	}	
		
});

app.use('/', router);
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});