/** 
 * @Date : 2022-03-10 13:13:47
 * @Title : URL 객체
 * @Description : 주소 문자열과 요청 파라미터 다루기
 */


const url = require('url');
const querystring = require('querystring');

// 주소 문자열을 URL 객체로 만들기
// 예제에 나와있는 parse() 메서드는 deprecated됨. WHATWG URL API를 사용하라고 함.
let curlURL = url.parse('https://m.search.naver.com/search.naver?query=steve+jobs&where=m&sm=mtp_hty');
let curlURL2 = new URL('https://m.search.naver.com/search.naver?query=steve+jobs&where=m&sm=mtp_hty');

console.dir(curlURL);
console.dir(curlURL2);

let param = querystring.parse(curlURL.query);
console.log(querystring.stringify(param));