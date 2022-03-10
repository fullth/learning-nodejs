/** 
 * @Date : 2022-03-10 22:18:24
 * @Title : 버퍼
 * @Description : 버퍼 객체 사용하는 방법.
 */


let data = 'Hello~!';
// 기존의 Buffer 생성자가 deprecated 되고 Buffer.from() 방식을 권함.
let buffer1 = new Buffer.from(data);
let len = buffer1.write(data, 'utf8');
console.log(buffer1.toString());

// 버퍼의 타입을 확인함.
console.log(Buffer.isBuffer(buffer1));

// 버퍼 객체에 들어 있는 문자열 데이터를 문자열 변수로 만듬.
let byteLenth = Buffer.byteLength(data);
let str1 = buffer1.toString('utf8', 0, byteLenth);

let buffer2 = new Buffer.from('World~!', 'utf-8');
let str2 = buffer2.toString('utf8');

// 첫 번째 버퍼 객체의 문자열을 두 번째 버퍼 객체로 복사
buffer1.copy(buffer2, 0, 0, len);
console.log(buffer2.toString('utf-8'));

// 두 개의 버퍼를 붙여줌.
let buffer3 = Buffer.concat([buffer1, buffer2]);
console.log(buffer3.toString('utf-8'));
