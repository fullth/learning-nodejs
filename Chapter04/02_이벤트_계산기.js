const util = require('util');
const EventEmitter = require('events').EventEmitter;

let Calc = function() {
    let self = this;

    this.on('stop', function() {
        console.log('Calc에 stop 이벤트가 전달되엇습니다.');
    });
};

util.inherits(Calc, EventEmitter);

Calc.prototype.add = function(a,b) {
    return a + b;
}

module.exports = Calc;
module.exports.title = 'calculator';
