
/*
 * 핸들러 모듈 파일에 대한 정보
 * 
 * 핸들러는 서버 쪽에 만들어지는 하나의 함수라고 생각하면 쉽습니다.
 */

console.log('handler_info 파일 로딩됨.');

// file: 핸들러 모듈의 파일이름.
// method: 등록한 핸들러의 이름.
var handler_info = [
	{file:'./echo', method:'echo'}			
  , {file:'./echo_error', method:'echo_error'}
  , {file:'./add', method:'add'}
];

module.exports = handler_info;