/** 
 * @Date : 2022-03-11 22:51:42
 * @Title : Express
 * @Description : express에 포함된 router 미들웨어 사용
 */


// 기본모듈 불러오기
const express = require('express'); 
const router = express.Router();
const http = require('http');
const path = require('path');

// 미들웨어 불러오기
const bodyParser = require('body-parser');
const static = require('serve-static');

const logger = require('../../logger');

let app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

router.route('/process/login').post(function(req, res) {
    logger.info('/process/login 처리함');

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<p>' + paramId)
    res.write(' ' + paramPassword + '</p>');
    res.end();
});

app.use('/', router);

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});