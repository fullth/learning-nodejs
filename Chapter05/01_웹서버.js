/** 
 * @Date : 2022-03-11 19:03:54
 * @Title : 웹서버
 * @Description : 노드의 기능을 사용하여 웹 서버 객체를 만들어 본다.
 */


const http = require('http');
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

	res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
	res.write("<!DOCTYPE html>");
	res.write("<html>");
	res.write(" <head>");
	res.write("     <title>응답 예제</title>");
	res.write(" </head>");
	res.write(" <body>");
	res.write("     <h1>응답 예제</h1>");
	res.write(" </body>");
	res.write("</html>");
	res.end();
});

server.on('close', function() {
    logger.info('서버가 종료됩니다.');
});