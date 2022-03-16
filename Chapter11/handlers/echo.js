/**
 * 에코 핸들러
 * 
 * 클라이언트에서 보낸 데이터를 그대로 다시 반환해줍니다.
 * 핸들러 함수는 결과 값을 callback함수로 전달합니다. 반환값이 없습니다. 즉 return 키워드를 사용하지 않습니다.
 */

let echo = function(param, callback) {
    console.log('JSON-RPC echo 호출됨.');
    console.dir(param);
    callback(null, param); // callback(오류전달, 정상데이터);
};

module.exports = echo;