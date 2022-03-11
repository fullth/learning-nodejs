/** 
 * @Date : 2022-03-11 21:18:04
 * @Title : 웹서버 파일
 * @Description : 스트림으로 읽어 응답 보내기
 */


const http = require('http');
const fs = require('fs');
const logger = require('../logger');

let server = http.createServer();

let host = 'localhost';
let port = 3000;

server.listen(port, host, function(){
    logger.info(port + '번 포트로 웹서버가 시작되었습니다.');
});

server.on('connection', function(socket) {
    let addr = socket.address();
    logger.info('클라이언트가 접속했습니다. : ' + addr.address + ', ' + addr.port);
});

server.on('request', function(req, res) {
    logger.info('클라이언트 요청이 들어왔습니다.');

	let filename = 'Chapter05/house.png';
	let infile = fs.createReadStream(filename, {flags: 'r'});

	infile.pipe(res);
});

server.on('close', function() {
    logger.info('서버가 종료됩니다.');
});