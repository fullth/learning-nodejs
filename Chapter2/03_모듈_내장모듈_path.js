/** 
 * @Date : 2022-03-09 00:44:43
 * @Title : 내장모듈
 * @Description : path 모듈 사용
 */


let path = require('path')

let directories = ['fruits', 'colors', 'laptops'];

// join: 여러 개의 이름들을 모두 합쳐 하나의 파일 패스로 만들어줌.
let docsDirectory = directories.join(path.sep);
console.log(docsDirectory)

let curPaths = path.join('/C/Documents', 'ReadMe.md');
console.log(curPaths);

// 패스를 이용해서 경로의 디렉터리, 파일 이름, 확장자를 구분할 수 있음.
let curDirectory = path.dirname(curPaths);
console.log(curDirectory);
let curFileName = path.basename(curPaths);
console.log(curFileName);
let curExtension = path.extname(curPaths);
console.log(curExtension);