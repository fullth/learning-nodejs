/** 
 * @Date : 2022-03-11 21:49:47
 * @Title : Express
 * @Description : express 모듈을 사용하여 웹 서버 구현
 */


// 노드에 내장된 모듈 또는 npm으로 설치한 외장 모듈은 상대 패스가 아닌 이름만 지정하도록 설정되있음.
const express = require('express'); // http 모듈 위에서 동작함. 항상 http모듈도 함께 불러들여야 함.
const http = require('http');
const logger = require('../../logger');

let app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

http.createServer(app.listen(app.get('port'), function() {
    logger.info('익스프레스 서버를 시작했습니다. : ' + app.get('port'));
}));