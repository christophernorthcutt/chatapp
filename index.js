const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var bodyParser = require('body-parser')
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
  //extended: true
//}));
app.use(express.static(__dirname + '/'));
//app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))

///////////////

app.get('/', (req, res) => {
	res.sendFile('index.html', {root: __dirname});
})

//////////////

var nicknamesMap = new Map();
var nicknamesValue = [];

io.on('connection', function(socket) {
	//console.log("connected!");
	io.emit('update namelist', nicknamesValue);

	//default disconnect
	socket.on('disconnect', function() {
		if (socket.nicknameIsSet) {
			io.emit('user disconnected', socket.nickname);
			nicknamesMap.delete(socket.id);
			nicknamesValue = [];
			io.emit('update namelist', nicknamesValue);
		}
	});

	socket.on('update namelist', function() {
		nicknamesValue = [];
		for (var value of nicknamesMap.values()) {
			nicknamesValue.push(value);
		}
		io.emit('update namelist', nicknamesValue);
		//console.log(nicknamesValue);
	});

	socket.on('set nickname', function(nickname) {
		if (nickname.length <= 15) {
			socket.nickname = nickname;
			socket.nicknameIsSet = true;
			nicknamesMap.set(socket.id, socket.nickname);
			io.emit('set nickname', socket.nickname);
			//console.log(nicknamesMap);
		}
	});

	socket.on('chat message', function(msg) {
		if (socket.nicknameIsSet) {
			if (msg != "" && msg != " " && msg.length <= 300) {
				io.emit('chat message', socket.nickname, msg);
			}
		}
		else {
			io.to(socket.id).emit('setnick message');
		}
	});
});

//////////////

http.listen(8000, () => console.log("listening on port 8000..."))
