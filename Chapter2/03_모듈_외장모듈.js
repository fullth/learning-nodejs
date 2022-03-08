/** 
 * @Date : 2022-03-09 00:44:43
 * @Title : 외장모듈
 * @Description : 
 */


let nconf = require('nconf');
nconf.env();

console.dir(nconf)
console.log(nconf.get('stores'));