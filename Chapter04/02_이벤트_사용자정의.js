process.on('tick', function(count) {
    console.log('직접 정의한 tick 이벤트 발생함 : %s', count);
});

setTimeout(function() {
    console.log('2초 후 시스템 종료 시도');

    process.emit('tick', '2');
}, 2000);
