const fs = require('fs');

fs.open('03_파일_write.txt', 'a+', function(err, fd) {
    if(err) throw err;

    let buf = new Buffer('Hi!\n');
    fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) {
        if(err) throw err;
        
        console.log(err, written, buffer);

        fs.close(fd, function() {
            console.log('완료');
        });
    });
});