// Dependencies
let express = require('express');
let http = require('http');
let path = require('path');
let socketIO = require('socket.io');

let app = express();
let server = http.Server(app);
let io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// index page
app.get('/', function (request, response) {

	response.sendFile(path.join(__dirname, 'index.html'));

});

// listens on port 5000
// eg http://localhost:5000/
server.listen(5000, function () {
	console.log('Starting server on port 5000');
});

// random place on canvas
function random() {
	return Math.floor(Math.random() * 600) + 1;
}

// players object
let players = {};
io.on('connection', function (socket) {
	// spawn the player at random x y
	socket.on('new player', function () {
		players[socket.id] = {
			x: random(),
			y: random(),
			att: 0
		};
	});

	// remove the player on discconect
	socket.on('disconnect', function () {
		console.log(socket.id);
		delete players[socket.id];
	});


	let speed = 1;
	// handle the movement event
	socket.on('movement', function (data) {
		io.sockets.emit('action', players);
		let player = players[socket.id] || {};
		if (data.left) {
			player.x -= speed;
			if (player.x <= 0) {
				player.x = 800;
			}
		}

		if (data.up) {
			player.y -= speed;
			if (player.y <= 0) {
				player.y = 600;
			}
		}

		if (data.right) {
			player.x += speed;
			if (player.x >= 800) {
				player.x = 0;
			}
		}

		if (data.down) {
			player.y += speed;
			if (player.y >= 600) {
				player.y = 0;
			}
		}
		if (data.attack == true) {
			player.att = 1;
		} else {

			player.att = 0;
		}


	});

});


// update the game 
setInterval(function () {
	io.sockets.emit('state', players);
}, 1000 / 60);