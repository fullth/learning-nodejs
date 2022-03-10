/** 
 * @Date : 2022-03-10 17:52:27
 * @Title : 파일다루기
 * @Description : 파일일기
 */


const fs = require('fs'); 

// 파일을 동기식 IO로 읽음.
let readFileSyncData = fs.readFileSync('./package.json', 'utf8');
console.log(readFileSyncData);

// 파일을 비동기식 IO로 읽음.
fs.readFile('./package.json', 'utf8', function(err, data) {
    console.log(data);
});

// 아래 문구가 먼저 출력되고 위의 파일 데이터가 출력됨.
console.log('package.json 파일을 읽도록 요청했습니다.')