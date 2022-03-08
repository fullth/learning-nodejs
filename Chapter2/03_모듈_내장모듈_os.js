/** 
 * @Date : 2022-03-09 00:44:43
 * @Title : 내장모듈
 * @Description : os 모듈 사용
 */


let os = require('os');

console.log(os.hostname);
console.log(os.totalmem);
console.log(os.cpus);
console.log(os.networkInterfaces);