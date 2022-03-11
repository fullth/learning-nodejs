/** 
 * @Date : 2022-03-11 22:29:54
 * @Title : Express
 * @Description : body-parser 미들웨어 사용
 */


// 기본모듈 불러오기
const express = require('express'); 
const http = require('http');
const path = require('path');

// 미들웨어 불러오기
const bodyParser = require('body-parser');
const static = require('serve-static');

const logger = require('../../logger');

let app = express();

app.set('port', process.env.PORT || 3000);

// body-parser를 이용해서 application/x-www-form-urlencoded를 파싱해온다.
app.use(bodyParser.urlencoded({ extended : false }));
// application/json을 파싱해온다.
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
logger.info(__dirname);

app.use(function(req, res, next) {
    logger.info('첫 번째 미들웨어에서 요청을 처리함.');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<p>' + paramId)
    res.write(' ' + paramPassword + '</p>');
    res.end();
});

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});