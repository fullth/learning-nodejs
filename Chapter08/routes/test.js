let test1 = function(req, res) {

    console.log('test 모듈 안에 있는 test1 호출됨.');
	
	// 뷰 템플레이트를 이용하여 렌더링한 후 전송
	let context = {};
	req.app.render('test1_success', context, function(err, html) {
		console.log('rendered : ' + html);
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.end(html);
	});
};

module.exports.test1 = test1;