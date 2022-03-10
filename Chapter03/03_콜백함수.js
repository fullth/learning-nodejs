/** 
 * @Date : 2022-03-10 08:50:25
 * @Title : 콜백함수
 * @Description : 콜백함수 이해 및 활용
 */


function add(a, b, callback) {
    let result = a + b;
    callback(result); // 익명함수로 만들어 파라미터로 전달
}

add(10, 10, function(result) {
    console.log(result);
});

/**
 * 반환값으로 함수를 만들어 반환할 수 있음.
 * 
 * 하나의 함수로 추가적인 결과를 얻거나, 추가 작업을 할 수 있음.
 */
function add2(a, b, callback) {
    let result = a + b;
    callback(result);

    let history = function() {
        return a + '+' + b + '=' + result;
    }
    return history;
}

// 출력하고자 하는 덧셈 결과는 콜백함수를 통해 전달받고, 연산의 기록은 함수를 반환받아서 사용.
let add_history = add2(10, 10, function(result) {
    console.log('파라미터로 전달된 콜백 함수 호출됨');
    console.log(result);
});

console.log('결과 값으로 받은 함수 실행 결과 >>> ' + add_history());

function add3(a, b, callback) {
    let result = a + b;
    callback(result);

    let cnt = 0;
    let history = function() {
        cnt++;
        return cnt + ':' + a + '+' + b + '=' + result;
    }
    return history;
}

// 출력하고자 하는 덧셈 결과는 콜백함수를 통해 전달받고, 연산의 기록은 함수를 반환받아서 사용.
let add_history2 = add3(10, 10, function(result) {
    console.log('파라미터로 전달된 콜백 함수 호출됨');
    console.log(result);
});

/**
 * add_history2에서 반환된 history를 실행할 때는, 이미 메모리가 add2에 접근할 수 없지만
 * 함수안에서 함수를 만들어 반환하는 경우엔 변수 접근을 허용함. => 이를 클로저(Closure) 라고 부름
 */
console.log('결과 값으로 받은 함수 실행 결과 >>> ' + add_history2()); //1
console.log('결과 값으로 받은 함수 실행 결과 >>> ' + add_history2()); //2
console.log('결과 값으로 받은 함수 실행 결과 >>> ' + add_history2()); //3
