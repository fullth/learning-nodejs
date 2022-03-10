/** 
 * @Date : 2022-03-10 11:49:25
 * @Title : 프로토타입 객체
 * @Description : 
 */


function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.walk = function(speed) {
    console.log(speed + 'km 속도로 걸어갑니다.');
}

let Person01 = new Person('Tom', 18);
let Person02 = new Person('Tom', 22);

console.log(Person01.name);
console.log(Person01.age);
Person01.walk(10);
