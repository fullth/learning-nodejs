/** 
 * @Date : 2022-03-11 21:33:41
 * @Title : 웹서버 통신
 * @Description : 다른 웹 사이트의 데이터를 가져와 응답하기
 */


const http = require('http');
const logger = require('../logger');

let option = {
	host: 'www.google.com',
	port: 80,
	path: '/'
}

let req = http.get(option, function(res) {
	let resData = '';
	res.on('data', function(chunk) {
		resData += chunk;
	});

	res.on('end', function() {
		logger.info(resData);
	})
});

req.on('error', function(err) {
	logger.error('오류 발생 >>> ' + err.message);
});