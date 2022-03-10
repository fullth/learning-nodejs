/** 
 * @Date : 2022-03-09 17:23:11
 * @Title : 변수
 * @Description : 객체 사용법
 */


let Person = {};

Person['age'] = 333;
Person['name'] = 'TH';
Person['mobile'] = '010-1234-5678';

console.log('나이: %d', Person.age);
console.log('이름: %s', Person.name);
console.log('번호: %s', Person.mobile);
