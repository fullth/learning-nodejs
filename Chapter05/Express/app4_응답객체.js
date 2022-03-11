const express = require('express'); 
const http = require('http');
const logger = require('../../logger');

let app = express();

app.use(function(req, res, next) {
    logger.info('첫 번째 미들웨어에서 요청을 처리함.');

    res.send({name: 'TH', age: 26})
});

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});