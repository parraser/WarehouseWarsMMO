const Player = require('./static-content/Player.js');
const Blank = require('./static-content/Blank.js');
const Box = require('./static-content/Box.js');
const Wall = require('./static-content/Wall.js');
const Monster = require('./static-content/Monster.js');
const SmartMonster = require('./static-content/SmartMonster.js');

///////////Stage
function Stage(width, height) {
	// Images
	this.imageXSize = 24;
	this.imageYSize = 24;
	// Image Source
	this.blankImage = "/icons/blank.gif";
	this.boxImage = "/icons/emblem-package-2-24.png";
	this.selfPlayerImage = "/icons/mexican.png";
	this.otherPlayerImage = "/icons/guitar.png";
	this.monsterImage = "/icons/popo.png";
	this.SmartmonsterImage = "/icons/trump.png";
	this.wallImage = "/icons/wall.jpeg";

	// Draw Board
	this.width = width;
	this.height = height;

	this.drawBoard = new Array(this.width);
	for (var i = 0; i <= this.width; i++) {
		this.drawBoard[i] = new Array(this.height);
	}	
	
	for (var x = 0; x < this.width; x++) {
		for (var y = 0; y < this.height; y++) {
			this.drawBoard[x][y] = new Blank(x, y, this.blankImage);
		}
	}

	// Viewing window
	this.viewX = 19;
	this.viewY = 19;

	// Playing Board
	//this.fieldWidth = width - 2;
	//this.fieldHeight = height - 2;

	this.field = [];

	this.PLAYER_LIST = {};
}

Stage.prototype.addPlayer = function(player, id) {
	this.PLAYER_LIST[id] = player;
	this.drawBoard[10][10] = player;
	this.addItem(player);
}

Stage.prototype.removePlayer = function(id) {
	delete this.PLAYER_LIST[id];
}

Stage.prototype.initialize = function() {
	// Outer Wall
	for (var x = 0; x <= this.width; x++) {
		for (var y = 0; y <= this.height; y++) {
			if (x == 0 || y == 0 || x == this.width || y == this.height) {
				this.drawBoard[x][y] = new Wall(x, y, this.wallImage);
				//this.addItem(new Wall(x, y, this.wallImage));

			}
		}

	}

	// Randomized Boxes
	var boxes = (this.fieldWidth * this.fieldHeight) / 3;
	var x,y;
	for (var i = 0; i < boxes; i++) {
		x = Math.floor(Math.random() * (this.width - 2));
		y = Math.floor(Math.random() * (this.heighteight - 2));
		this.drawBoard[x][y]= new Box(x, y, this.boxImage);
		this.addItem(this.drawBoard[x][y]);
	}

//Random Monster

	for (var i = 0; i < 4; i++) {
		x = Math.floor(Math.random() * (this.width - 2));
		y = Math.floor(Math.random() * (this.height - 2));
		this.drawBoard[x][y] = new Monster(x, y, this.monsterImage);
		this.addItem(this.drawBoard[x][y]);
	}
//Smart Monster
x = Math.floor(Math.random() * (this.width - 2));
y = Math.floor(Math.random() * (this.height - 2));
this.drawBoard[x][y] = new SmartMonster(x, y, this.SmartmonsterImage);
this.addItem(this.drawBoard[x][y]);
	
}

Stage.prototype.move = function(direction, id) {
	//console.log(this.PLAYER_LIST[id].isDead());
	
	if(!this.PLAYER_LIST[id].isDead()){
		var x = this.PLAYER_LIST[id].getPosition()[0];
		var y = this.PLAYER_LIST[id].getPosition()[1];
		this.PLAYER_LIST[id].move(direction, this.field,this.drawBoard);
		this.drawBoard[x][y] = new Blank(x,y,this.blankImage);	

	}
	else{
		var message = JSON.stringify({type: 'death'});
		wss.broadcast(message);
	}
}

Stage.prototype.step = function() {
	
	for (var i = 0; i < this.field.length; i++) {
		var f = this.field[i];
		
		if (f.getType() == 'monster' || f.getType() == 'smartMonster'){
			var randX = Math.floor((Math.random() * 3) - 1);
			var randY = Math.floor((Math.random() * 3) - 1);
			var dir = [randX,randY];
			f.move(dir,this.field, this.drawBoard);
			if(f.getCount() == 10){
				//this.addItem(new Wall(f.getPosition()[0] - randX, f.getPosition()[1]-randY, this.wallImage));
				this.drawBoard[f.getPosition()[0] - randX][f.getPosition()[1]-randY] = new Wall(f.getPosition()[0] - randX, f.getPosition()[1]-randY, this.wallImage);
			}
			else{
				this.drawBoard[f.getPosition()[0] - randX][f.getPosition()[1]-randY] = new Blank(f.getPosition()[0] - randX,f.getPosition()[1]-randY, this.blankImage);
			}
		}

	}
var message = JSON.stringify({type: 'position', s: this});

wss.broadcast(message);

}



Stage.prototype.addItem = function(item) {
	var x = item.getPosition()[0];
	var y = item.getPosition()[1];
	for (var i = 0; i < this.field.length; i++) {
		var f = this.field[i];
		if (x == f.getPosition()[0] && y == f.getPosition()[1]) {return false;}
	}
	this.field.push(item);
	this.drawBoard[x][y] = item;
	return true;
}

////// SERVER CODE

console.log("server syuff");
var WebSocketServer = require('ws').Server
   ,wss = new WebSocketServer({port: 10792});

var SOCKET_LIST = {};
var USER_LIST = {};

var User = function(id) {
	var self = {
		id:id,
		pressingRight: false,
		pressingLeft: false,
		pressingUp: false,
		pressingDown: false
	}
	self.move = function() {
		if (self.pressingRight) {
			move([0, 1], self.id);
			var position = JSON.stringify({type: 'position', s: stage});
			wss.broadcast(position);
			self.pressingRight = false;	
		}
		if (self.pressingLeft){
			move([0, -1], self.id);
			var position = JSON.stringify({type: 'position', s: stage});
			wss.broadcast(position);
			self.pressingLeft = false;
		}
		if (self.pressingUp){
			move([-1, 0], self.id);
			var position = JSON.stringify({type: 'position', s: stage});
			wss.broadcast(position);
			self.pressingUp = false;
		}
		if (self.pressingDown){
			move([1, 0], self.id);
			var position = JSON.stringify({type: 'position', s: stage});
			wss.broadcast(position);
			self.pressingDown = false;
		}
	}

	return self;
}

var stage = null;
stage = new Stage(20, 20);
stage.initialize();

function move(direction, id) {
	stage.move(direction, id);
	
}

wss.on('connection', function(socket){
	socket.id = Math.random();
	var user = User(socket.id);
	var f = 5;
	stage.addPlayer(new Player(10, 10, "/icons/mexican.png"), socket.id);
	f = f + 5;
	var newCon = JSON.stringify({type: 'newStage', s: stage, ID: socket.id});
	socket.send(newCon);
	
	wss.broadcast(JSON.stringify({type: 'playerUpdate', players: stage.PLAYER_LIST}));

	SOCKET_LIST[socket.id] = socket;
	USER_LIST[socket.id] = user;

	socket.onclose = function() {
		delete SOCKET_LIST[socket.id];
		delete USER_LIST[socket.id];
		stage.removePlayer(socket.id);
	};

	socket.onmessage = function(evt) {
		var data = JSON.parse(evt.data);
		if (data.type == 'keyPress') {
			if (data.inputID == 'up'){user.pressingUp = data.state;}
			else if (data.inputID == 'down'){user.pressingDown = data.state;}
			else if (data.inputID == 'left'){user.pressingLeft = data.state;}
			else if (data.inputID == 'right'){user.pressingRight = data.state;}
		}
	};
});

wss.broadcast = function(message){
	for(let ws of this.clients){ 
		ws.send(message);
	}
}

setInterval(function() {
	for (var i in USER_LIST) {
		var user = USER_LIST[i];
		user.move();
	}

}, 1000/10);

setInterval(function() {
	stage.step();

}, 10000/10);


