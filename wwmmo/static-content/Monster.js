module.exports = class Monster {
	constructor(x,y,icon){
		this.x = x;
		this.y = y;
		this.icon = icon;
		this.dead = false;
	}


	getPosition() {
		return [this.x, this.y];
	}

	getIcon() {
		return this.icon;
	}

	getType() {
		return 'monster';
	}
	getCount() {
		return 0;
	}
	isDead() {
		return this.dead;
	}

	death(drawBoard){
		
		var wallImage = "/icons/wall.jpeg";
		var boxImage = "/icons/emblem-package-2-24.png";

		var North = (drawBoard[this.x-1][this.y].getType() == 'wall' || drawBoard[this.x-1][this.y].getType() == 'box');
		var South = (drawBoard[this.x+1][this.y].getType() == 'wall' || drawBoard[this.x+1][this.y].getType() == 'box');
		
		var West = (drawBoard[this.x][this.y-1].getType() == 'wall' || drawBoard[this.x][this.y-1].getType() == 'box');	
		var East = (drawBoard[this.x][this.y+1].getType() == 'wall' || drawBoard[this.x][this.y+1].getType() == 'box');

		var NorthEast = (drawBoard[this.x-1][this.y+1].getType() == 'wall' || drawBoard[this.x-1][this.y+1].getType() == 'box');		
		var NorthWest = (drawBoard[this.x-1][this.y-1].getType() == 'wall' || drawBoard[this.x-1][this.y-1].getType() == 'box');	
	
		var SouthEast = (drawBoard[this.x+1][this.y+1].getType() == 'wall' || drawBoard[this.x+1][this.y+1].getType() == 'box');
		var SouthWest = (drawBoard[this.x+1][this.y-1].getType() == 'wall' || drawBoard[this.x+1][this.y-1].getType() == 'box');			
		
		this.dead = North && South && West && East && SouthWest && SouthEast && NorthEast && NorthWest;
		return this.dead;
	}

	move(direction, field,drawBoard) {
		if(this.death(drawBoard)){
			this.x = 0;
			this.y = 0;
			this.icon = "/icons/blank.gif";
			field.pop();
			return;

		}

		for (var i = 0; i < field.length; i++) {
			var item = field[i];
			var x = item.getPosition()[0];
			var y = item.getPosition()[1];

			if (this.x + direction[0] == x && this.y + direction[1] == y) {
				console.log(item.getType());	
				console.log("OG POSITION x = " + this.x + " y = " + this.y);
				console.log(" OTHER POST x = " + x + " y = " + y);
				if (item.getType() == 'box') {
						return false;
				}else if(item.getType() == 'monster'){
						return;

				}else if(item.getType() == 'smartMonster'){
						return;


				}else if(item.getType() == 'player'){
					item.death();
				}
				else if (item.getType() == 'wall')
					return;
			}
		}

		drawBoard[this.x][this.y].icon = "/icons/blank.gif";
		this.y += direction[1];
		this.x += direction[0];
		drawBoard[this.x][this.y] = this;
		return true;
	}

}


	
