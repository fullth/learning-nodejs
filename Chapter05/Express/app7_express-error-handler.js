/** 
 * @Date : 2022-03-11 23:08:55
 * @Title : Express
 * @Description : 오류 페이지 제어를 미들웨어를 통해 할 수 있다.
 */


// 기본모듈 불러오기
const express = require('express'); 
const router = express.Router();
const http = require('http');
const path = require('path');

// 미들웨어 불러오기
const bodyParser = require('body-parser');
const static = require('serve-static');
const expressErrorHandler = require('express-error-handler');

const logger = require('../../logger');

let app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());
app.use('/public', static(path.join(__dirname, 'public')));

router.route('/process/login/:name').post(function(req, res) {
    logger.info('/process/login/:name 처리함');

    let paramName = req.params.name;

    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
    res.write('<div><p>' + paramName + '</p></div>');
    res.write('<p>' + paramId);
    res.write(' ' + paramPassword + '</p>');
    res.end();
});

// app.all('*', function(req, res) {
//     res.status(404).send('<h1>404 Error- 페이지를 찾을 수 없습니다!</h1>');
// });

let errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
app.use('/', router);

http.createServer(app).listen(3000, function() {
    logger.info('익스프레스 서버를 시작했습니다. : ');
});