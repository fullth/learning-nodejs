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

let socketio = require('socket.io');
let cors = require('cors');

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

app.use(cors());

//라우팅 정보를 읽어들여 라우팅 설정
let router = express.Router();
route_loader.init(app, router);

let configPassport = require('./config/passport');
configPassport(app, passport);

let userPassport = require('./routes/user_passport');
const { send } = require('process');
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

let login_ids = {};
let io = socketio.listen(server);
logger.info('소켓 요청을 받아드릴 준비가 되었습니다.');

io.sockets.on('connection', (socket) => {
	logger.info('connection info: ', socket.request.connection._peername);

	socket.remoteAddress = socket.request.connection._peername.address;
	socket.remotePort = socket.request.connection._peername.port;	

	// 서버에서 모든 클라이언트에게 전송함. 하나의 브라우저에서 전송하고 다른 브라우저에서 확인하면 다른 브라우저에도 전송되는 것을 볼 수 있음.
	socket.on('message', function(message) {
		if(message.recepient == 'ALL') {
			console.dir('나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다.')
			io.sockets.emit('message', message);
		} else {
			if(message.command == 'chat') {				
				if(login_ids[message.recepient]) {
					io.sockets.connected[login_ids[message.recepient]].emit('message', message);
					
	
					sendResponse(socket, 'message', '200', '메시지를 전송했습니다.');
				} else {
					sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없습니다.');
				}
			} else if(message.command == 'groupchat') { // 게임 전체 공지 등으로 활용할 수 있음.
				io.sockets.in(message.recepient).emit('message', message);

				sendResponse(socket, 'message', '200', `방 [${message.recepient}]의 모든 사용자들에게 메시지를 전송했습니다.`);
			}
		}
	});

	socket.on('login', function(login) {
		console.dir(login);
		logger.info('접속한 소켓의 ID: ' + socket.id);
		login_ids[login.id] = socket.id;
		console.dir(login_ids);
		socket.login_id = login.id;
		logger.info('접속한 소켓의 ID: ' + socket.id);

		logger.info(`접속한 클라이언트 ID 개수 : ${Object.keys(login_ids).length}`);

		sendResponse(socket, 'login', '200', '로그인되었습니다.');
	})

	socket.on('room', function(room) {
		console.dir(room);

		if(room.command === 'create') {
			if(io.sockets.adapter.rooms[room.roomId]) {
				console.log('방이 이미 만들어져 있습니다.');
			} else {
				console.log('방을 새로 만듭니다.');

				socket.join(room.roomId);

				let curRoom = io.sockets.adapter.rooms[room.roomId];
				curRoom.id = room.roomId;
				curRoom.name = room.roomName;
				curRoom.owner = room.roomOwner;
			}
		} else if(room.command === 'update') {
			let curRoom = io.sockets.adapter.rooms[room.roomId];
			curRoom.id = room.roomId;
			curRoom.name = room.roomName;
			curRoom.owner = room.roomOwner;
		} else if(room.command === 'delete') {
			socket.leave(room.roomId);

			if(io.sockets.adapter.rooms[room.roomId]) {
				delete io.sockets.adapter.rooms[room.roomId];	
			} else {
				console.log('방이 만들어져 있지 않습니다.');
			}
		} else if(room.command === 'join') {
			socket.join(room.roomId);
			
			sendResponse(socket, 'room', '200', '방에 입장했습니다.');
		} else if(room.command === 'leave') {
			socket.leave(room.roomId);

			sendResponse(socket, 'room', '200', '방에 나갔습니다.');
		}

		let roomList = getRoomList();
		let output = {command: 'list', rooms: roomList};
		console.log('클라이언트로 보낼 데이터' + JSON.stringify(output));

		io.sockets.emit('room', output);
	})
});

function sendResponse(socket, command, code, message) {
	let statusObj = {command: command, code: code, message: message};
	socket.emit('response', statusObj);
}

function getRoomList() {
	console.dir(io.sockets.adapter.rooms);

	let roomList = [ ];

	Object.keys(io.sockets.adapter.rooms).forEach(function(roomId) {
		console.log('current room id : ' + roomId);
    	var outRoom = io.sockets.adapter.rooms[roomId];
    	
    	// find default room using all attributes
    	var foundDefault = false;
    	var index = 0;
        Object.keys(outRoom.sockets).forEach(function(key) {
        	console.log('#' + index + ' : ' + key + ', ' + outRoom.sockets[key]);
        	
        	if (roomId == key) {  // default room
        		foundDefault = true;
        		console.log('this is default room.');
        	}
        	index++;
        });
        
        if (!foundDefault) {
        	roomList.push(outRoom);
        }
    });
    
    console.log('[ROOM LIST]');
    console.dir(roomList);
    
    return roomList;
}