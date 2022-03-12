/** 
 * @Date : 2022-03-13 00:08:53
 * @Title : exports에 객체 저장
 * @Description : 
 */


// exports는 속성. exports에 속성을 추가하면 모듈에서 접근하지만, 객체를 지정하면 자바스크립트에서 새로운 변수로 처리함.
// 아래 코드만으로 모듈로서 해당 소스를 불러오면, exports에 객체를 할당하였기 때문에, 모듈 시스템에서 처리할 수 있는 전역변수가 아닌, 단순 변수로 인식됨.
// 이 때문에 exports를 참조할 수 없게 되고 객체에 아무것도 들어있지 않게 됨.
exports = {
    getUser: function() {
        return {id: 'fullth', name: 'TH'};
    },
    group: {id: 'group01', name: 'friends'}
}


// moduel.exports를 이용해 객체를 그대로 할당할 수 있음.
let user = {
    getUser: function() {
        return {id: 'fullth', name: 'TH'};
    },
    group: {id: 'group01', name: 'friends'}
}

module.exports = user;

// 함수도 객체이므로 함수를 그대로 할당할 수 있음. 
// module.exports로 할당한 익명함수를 모듈로 불러들이고 user 변수에 할당하면 user()와 같이 함수를 실행할 수 있음.
module.exports = function() {
    return {id: 'fullth', name: 'TH'};
}


