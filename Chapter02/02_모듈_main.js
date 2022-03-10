/** 
 * @Date : 2022-03-09 00:44:43
 * @Title : 모듈
 * @Description : 모듈 분리 방법 학습
 */


let calc = [];

calc.add = function(a, b) {
    return a + b;
}

console.log('모듈로 분리하기 전- calc.add 호출결과: ' + calc.add(1, 4));

let moduleCalc = require('./02_모듈_calc');
console.log('모듈로 분리하기 후- calc.add 호출결과: ' + moduleCalc.add(1, 4));

let moduleCalc2 = require('./02_모듈_calc2');
console.log(moduleCalc2.add(1, 4));

