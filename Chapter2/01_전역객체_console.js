/** 
 * @Date : 2022-03-09 00:44:43
 * @Title : console 전역객체
 * @Description : 콘솔창에 결과를 출력해주는 객체
 */


// console.time 사용해보기
let result = 0;

console.time('duration_sum')

for(let i = 0; i < 1000; i++) {
    result += i;
}

console.timeEnd('duration_sum')



// 전역변수 사용해보기
console.log(__dirname)
console.log(__filename)



// console.dir 사용해보기
let Person = {name: "tester", age: 20};
console.dir(Person)