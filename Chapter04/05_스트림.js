/** 
 * @Date : 2022-03-10 22:43:02
 * @Title : 스트림
 * @Description : 스트림 단위로 파일 읽고 쓰기.
 */

//ES6문법, package.json에 type을 추가해줘야 함.
import fs from 'fs';

let inFile = fs.createReadStream('./03_파일_write.txt', {flags: 'r'});
let outFile = fs.createWriteStream('./03_파일_write2.txt', {flags: 'w'});

inFile.on('data', function(data) {
    console.log('읽은 데이터', data);
    outFile.write(data);
});

inFile.on('end', function() {
    console.log('파일 읽기 종료');
    outFile.end(function() {
        console.log('파일 쓰기 종료');
    });
})