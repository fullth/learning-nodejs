/**
 * 몽구스 이벤트 로직 중 헷갈려서 복습.
 * 
 * 노드의 객체는 EventEmitter를 상속받을 수 있습니다.
 */

const { Mongoose } = require("mongoose");

// process 객체는 내부적으로 상속받고 있습니다.
// process 객체 244번라인 => interface Process extends EventEmitter { ...
process.on('exit', function() {
    console.log('exit이벤트가 발생하였습니다.');
});

// 아래와 같이, Mongoose안에서 이벤트 에미터를 상속받고 있으면 사용가능하지만, 상속받고 있지 않으면 에러가 발생합니다.
let database = {};
//database = mongoose.connection();

database.on('exit', function() {
    console.log('exit이벤트가 발생하였습니다.');
});