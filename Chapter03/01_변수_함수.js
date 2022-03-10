/** 
 * @Date : 2022-03-09 17:26:20
 * @Title : 함수
 * @Description : 자바스크립트는 변수에 함수를 할당할 수 있음
 */


function add (a, b) {
    return a + b;
}

let addResult = add(1, 3);

let add2 = function add2(a, b) {
    return a + b;
}

console.log(addResult);

// 변수에 할당할 수 있으므로, 객체의 속성으로도 할당할 수 있음.
let opObj = {
    add3: function(a, b) {
        return a + b
    }
}

console.log(opObj.add3(2,3));