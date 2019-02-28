let socket = io();

let movement = {
	attack: false,
	up: false,
	down: false,
	left: false,
	right: false
};

let game = true;
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
let img = document.getElementById("player");


// handle WSAD keys
document.addEventListener('keydown', function (event) {
	switch (event.keyCode) {
		case 65:
			movement.left = true;
			break;
		case 87:
			movement.up = true;
			break;
		case 68:
			movement.right = true;
			break;
		case 83:
			movement.down = true;
			break;
		case 32:
			movement.attack = 1;
			break;
	}
});
document.addEventListener('keyup', function (event) {
	switch (event.keyCode) {
		case 65:
			movement.left = false;
			break;
		case 87:
			movement.up = false;
			break;
		case 68:
			movement.right = false;
			break;
		case 83:
			movement.down = false;
			break;
		case 32:
			movement.attack = 0;
			break;
	}
});


/**
 * Emit the player movement
 */
socket.emit('new player');
setInterval(function () {
	socket.emit('movement', movement);
}, 1000 / 60);

/**
 * This is where out player dies :(
 */
function reset() {
	context.font = "14px Arial";
	context.fillText('przegryw hahah', 10, 20);
	img = document.getElementById("player-dead");
	game = false;
}



function between(x, min, max) {
	return x >= min && x <= max;
}

/**
 * handle players intersection
 * @param {Object} player 
 * @param {Object} players 
 */
let collision = function (player, players) {
	cp = players[player];
	if (!!cp) {
		let x = cp.x;
		let y = cp.y;

		let p = players;

		for (let i in players) {
			let other = players[i];
			if (i != player) {
				console.log('player.att');
				console.log(other.att);

				if (between(other.x, x - 20, x + 20) && between(other.y, y - 20, y + 20) && other.att == 1) {
					reset();
				}
			}
		}
	}
}

/**
 * 
 * @param {Int} x 
 * @param {Int} y 
 * @param {Boolean} a 
 */
function drawPlayer(x, y, a) {
	if (a == 1) {
		img = document.getElementById("player-attack");
		context.drawImage(img, x, y);
	} else {
		img = document.getElementById("player");
		context.drawImage(img, x, y);
	}

}


socket.on('state', function (players) {
	if (game === false) {
		return
	}

	context.clearRect(0, 0, 800, 600);
	let player = socket.id;
	collision(player, players);

	// draw the horses
	for (let id in players) {
		let player = players[id];
		context.beginPath();
		context.font = "14px Arial";
		context.fillText(player.x + " " + player.y, player.x + 10, player.y - 5);

		drawPlayer(player.x, player.y, player.att)

		context.fill();
	}

});