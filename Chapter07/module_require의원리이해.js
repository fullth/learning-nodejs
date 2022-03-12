let require = function(path) {
	let exports = {
		getUser: function() {
			return {id: 'fultlh', name: 'th'};
		},
		group:{id: 'group01', name: 'friends'}
	}
	
	return exports;
}

let user = require('...');

function showUser() {
	return user.getUser().name + ', ' + user.group.name;
}

console.log('사용자 정보 : %s', showUser());

