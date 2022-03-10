/** 
 * @Date : 2022-03-10 16:45:31
 * @Title : 이벤트
 * @Description : EventEmitter을 이용하여 이벤트를 주고받는 방법 학습
 */


process.on('exit', function() {
    console.log('exit 이벤트 발생함');
});

setTimeout(function() {
    console.log('2초 후 시스템 종료 시도');

    process.exit();
}, 2000);