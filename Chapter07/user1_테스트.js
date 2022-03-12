const logger = require('../logger');
const user1 = require('./user1_객체속성');

function showUser() {
    return user1.getUser().name + ', ' + user1.group.name;
}

logger.info(`사용자 정보: ${showUser()}`);

