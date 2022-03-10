const fs = require('fs');

fs.open('./03_파일_write.txt', 'r', function(err, fd) {
    if(err) throw err;

    let buf = new Buffer(10);
    console.log('버퍼 타입: %s', Buffer.isBuffer(buf));

    fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buffer) {
        if(err) throw err;

        let inStr = buffer.toString('utf8', 0, bytesRead);
        console.log('파일에서 읽은 데이터: %s', inStr);

        console.log(err, bytesRead, buffer);

        fs.close(fd, function() {
            console.log('완료');
        })
    })
});
