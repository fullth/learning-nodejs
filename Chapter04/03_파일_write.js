/** 
 * @Date : 2022-03-10 18:04:35
 * @Title : 파일다루기
 * @Description : 파일쓰기
 */


const fs = require('fs');

// 파일에 데이터를 씀.
fs.writeFile('/03_파일_write.txt', 'Hello World!', function(err) {
    if(err) {
        console.log('Error : ' + err);
    }

    console.log('파일에 데이터 쓰기 완료.');
});