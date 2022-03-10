/** 
 * @Date : 2022-03-09 00:44:43
 * @Title : process 전역객체
 * @Description : 프로세스의 실행에 대한 정보를 다루는 객체
 */


console.log('argv 속성의 파라미터 수: ' + process.argv.length)
console.dir(process.argv)



// 배열로 접근해보기
if(process.argv.length > 1) {
    console.log(process.argv[1])
} 



// forEach 사용해보기
process.argv.forEach(function(item, index) {
    console.log(index+1 + ' : ' + item);
});


// process의 env 속성 사용해보기
console.dir(process.env);
console.log('USER 환경 변수의 값: ' + process.env['USER']);