/** 
 * @Date : 2022-03-11 21:18:04
 * @Title : 웹서버 파일
 * @Description : 버퍼에 담아 두고 일부분만 읽어 응답 보내기
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
    let filelength = 0;
    let curlength = 0;

    fs.stat(filename, function(err, stats) {
        filelength = stats.size;
    });

    res.writeHead(200, {"Content-Type": "image/png"});

    infile.on('readable', function() {
        let chunk;
        while (null !== (chunk = infile.read())) {
            logger.info('읽어 들인 데이터 크기 : ' + chunk.length + '바이트');
            curlength += chunk.length;
            res.write(chunk, 'utf8', function(err) {
                logger.info('파일 부분 쓰기 완료: ' + curlength + ', 파일크기: ' + filelength);
                if(curlength >= filelength) {
                    res.end(); // write메서드가 종료되는 시점에 호출하여야 함. => 콜백함수를 전달하여 종료되는 시점 확인
                }
            });
        }
    });
});

server.on('close', function() {
    logger.info('서버가 종료됩니다.');
});