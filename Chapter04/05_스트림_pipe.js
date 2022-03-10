/** 
 * @Date : 2022-03-10 23:28:19
 * @Title : 스트림_pipe
 * @Description : 두 개의 스트림 붙이기
 */


const fs = require('fs');
const logger = require('./06_로그_logger.js');

let inname = './output.txt';
let outname = './output2.txt';

fs.exists(outname, function(exists) {
    if(exists) {
        fs.unlink(outname, function(err) {
            if(err) throw err;
            logger.info('기존파일 [' + outname + '] 삭제함');
        });
    }
    let infile = fs.createReadStream(inname, {flags: 'r'});
    let outfile = fs.createWriteStream(outname, {flags: 'w'});
    infile.pipe(outfile);
    logger.info('파일복사 [' + inname + '] -> [' + outname + ']');
});