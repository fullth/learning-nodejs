/** 
 * @Date : 2022-03-11 21:49:47
 * @Title : Express
 * @Description : 익스프레스에서 미들웨어의 사용
 */


// 노드에 내장된 모듈 또는 npm으로 설치한 외장 모듈은 상대 패스가 아닌 이름만 지정하도록 설정되있음.
const express = require('express'); // http 모듈 위에서 동작함. 항상 http모듈도 함께 불러들여야 함.
const http = require('http');
const logger = require('../../logger');

let app = express();

app.use(function(req, res, next) {
    logger.info('첫 번째 미들웨어에서 요청을 처리함.');

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>응답 결과</h1>');

});

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});