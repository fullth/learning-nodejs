/** 
 * @Date : 2022-03-09 17:48:55
 * @Title : 배열
 * @Description : 자바스크립트 배열 사용법
 */


let Users = [{name: 'Tom', job: 'Teacher'}, {name: 'Zin', job: 'Driver'}];
let Steeve = {name: 'Steeve', job: 'programmer'};

// 삽입
Users.push(Steeve);
Users.push({name: 'Yun', job: 'Chef'});
console.dir(Users);

Users.forEach(function(item, index) {
    console.log(index + 1 + ' ' + item.name);
})

// 삭제
Users.pop();
console.dir(Users);
console.log(Users.length); 

// 배열의 앞에 요소를 삽입과 삭제
Users.unshift({name: 'Yun', job: 'Chef'});
console.dir(Users);
Users.shift();
console.dir(Users);

// 삭제
delete Users[1]; // 메모리 공간은 남겨진 채, 객체만 삭제됨.
console.dir(Users);
console.log(Users.length);
console.log(Users[1]); // undefined로 조회는 됨.

// splice는 공간까지 없애줌
Users.splice(1,1);
console.dir(Users);

Users.splice(0, Users.length);
console.dir(Users);

let objArray = [{idx: 1}, {idx: 2}, {idx: 3}];
console.dir(objArray);

objArray.splice(1,2,{idx: 4});
console.dir(objArray);

// 배열 복사 slice(startIdx, endIdx)
let objArray2 = objArray.slice(1, 2);
console.dir(objArray2); // 4

let objArray3 = objArray.slice(0);
console.dir(objArray3);