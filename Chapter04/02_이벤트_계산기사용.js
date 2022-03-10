/** 
 * @Date : 2022-03-10 16:55:29
 * @Title : 이벤트 모듈
 * @Description : 별도의 모듈 파일안에서 이벤트를 처리하는 방법
 */


let Calc = require('./02_이벤트_계산기');

var calc = new Calc();
calc.emit('stop');

console.log(Calc.title + '에 stop 이벤트 전달함.');