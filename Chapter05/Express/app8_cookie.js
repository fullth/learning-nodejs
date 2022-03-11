/** 
 * @Date : 2022-03-11 23:08:55
 * @Title : Express
 * @Description : 오류 페이지 제어를 미들웨어를 통해 할 수 있다.
 */


// 기본모듈 불러오기
const express = require('express'); 
const http = require('http');
const path = require('path');

// 미들웨어 불러오기
const bodyParser = require('body-parser');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');

const logger = require('../../logger');

let app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());

let router = express.Router();

router.route('/process/showCookie').get(function(req, res) {
    logger.info('/process/showCookie가 호출되었습니다.');

    res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req, res) {
    logger.info('/process/setUserCookie가 호출되었습니다.');

    res.cookie('user', {
        id: 'fullth',
        name: 'TH',
        authorized: true
    });

    res.redirect('/process/showCookie');
});

app.use('/', router);

let errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});