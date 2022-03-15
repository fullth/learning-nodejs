var host;
var port;
var socket;

// 이벤트 관리
$(function() {
    // 서버 연결
    $("#connectButton").bind('click', function(event) {
        println('connectButton이 클릭되었습니다.');

        host = $('#hostInput').val();
        port = $('#portInput').val();
        
        connectToServer();
    });

    // 메세지 전송
    $("#sendButton").bind('click', (event) => {

        let chattype = $('#chattype option:selected').val();

        let sender = $('#senderInput').val();
        let recepient = $('#recepientInput').val();
        let data = $('#dataInput').val();

        let output = {sender: sender, recepient: recepient, command: chattype, type: 'text', data: data}
        console.log('서버로 보낼 데이터' + JSON.stringify(output));

        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('message', output)
    })

    // 로그인
    $("#loginButton").bind('click', function(event) {
        println('loginButton이 클릭되었습니다.');

        let id = $('#idInput').val();
        let password = $('#passwordInput').val();

        let output = {id: id, password: password}
        
        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('login', output);
    });

    // 방 생성
    $("#createRoomButton").bind('click', function(event) {
        let roomId = $('#roomIdInput').val();
        let roomName = $('#roomNameInput').val();
        let id = $('#idInput').val();

        let output = {command: 'create', roomId: roomId, roomName: roomName, roomOwner: id}
        
        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('room', output);
    });

    // 방 이름 수정
    $("#updateRoomButton").bind('click', function(event) {
        let roomId = $('#roomIdInput').val();
        let roomName = $('#roomNameInput').val();
        let id = $('#idInput').val();

        let output = {command: 'update', roomId: roomId, roomName: roomName, roomOwner: id}
        
        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('room', output);
    });

    // 방 삭제
    $("#deleteRoomButton").bind('click', function(event) {
        let roomId = $('#roomIdInput').val();
        let roomName = $('#roomNameInput').val();
        let id = $('#idInput').val();

        let output = {command: 'delete', roomId: roomId, roomName: roomName, roomOwner: id}
        
        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('room', output);
    });

    // 방 입장
    $("#joinRoomButton").bind('click', function(event) {
        let roomId = $('#roomIdInput').val();

        let output = {command: 'join', roomId: roomId}
        
        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('room', output);
    });

    // 방 나가기
    $("#leaveRoomButton").bind('click', function(event) {
        let roomId = $('#roomIdInput').val();

        let output = {command: 'leave', roomId: roomId}
        
        if(socket == undefined) {
            alert('서버에 연결되어 있지 않습니다. 서버와의 연결을 확인해주세요.');
            return;
        }

        socket.emit('room', output);
    });
});

// 서버 접속
function connectToServer() {
    var options = {'forceNew' : true};
    var url = 'http://' + host + ':' + port;

    socket = io.connect();

    socket.on('connect', function() {
        println('웹소켓 서버에 연결되었습니다. : ' + url);

        socket.on('message', function(message) {
            console.log(JSON.stringify(message));

            println('<p>수신메세지 : ' + message.sender + ', ' + message.recepient + ', ' + message.command + ', ' + message.type + ', ' + message.data + '</p>');
        });

        socket.on('response', function(response) {
            println('응답 메시지를 받았습니다.: ' + response.command + ', ' + response.code + ', ' +  response.message);   
        });
    });

    socket.on('disconnect', function() {
        println('웹소켓 연결이 종료되었습니다.');
    });
    
    socket.on('room', function(data) {
        println('<p>방 이벤트: ' + data.command + '</p>');
        println('<p>방 리스트를 받았습니다. </p>');
        if(data.command == 'list') {
            let roomCount = data.rooms.length;
            $("#roomList").html('<p>방 리스트' + roomCount + '개</p>');
            for(let i = 0; i < roomCount; i++) {
                $("#roomList").append('<p>방 #' + i + ' : ' + data.rooms[i].id + ', '
                    + data.rooms[i].name + ', ' + data.rooms[i].owner + '</p>');
            }
        }
    });
}

// 채팅창 메시지 프린트
function println(data) {
    console.log(data);
    $('#result').append('<p>' + data + '</p>');
}