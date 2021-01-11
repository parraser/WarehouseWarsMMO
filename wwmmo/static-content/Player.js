module.exports = class Player {

	constructor (x,y,icon){
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
		return 'player';
	}
	isDead() {
		return this.dead;
	}
	
	death(){
		this.x = 0;
		this.y = 0;
		this.icon = "/icons/blank.gif";	
		this.dead = true;
	}

	move(direction, field, drawBoard) {
		
		for (var i = 0; i < field.length; i++) {
			var item = field[i];
			var x = item.getPosition()[0];
			var y = item.getPosition()[1];
			if (this.x + direction[0] == x && this.y + direction[1] == y) {
				if (item.getType() == 'box') {
					if (item.move(direction, field, drawBoard)) {}
					else {return;}
				}
				else if ((item.getType() == 'monster') || (item.getType() == 'smartMonster')) {
					console.log("In monster");
					this.death();
					return;
				}
				else if (item.getType() == 'wall')
					return;
			}
		}
		if (this.x + direction[0] < 0 || this.x + direction[0] > 20){return;}
		if (this.y + direction[1] < 0 || this.y + direction[1] > 20){return;}
		this.x += direction[0];
		this.y += direction[1];
		drawBoard[this.x][this.y] = this.icon;

		
	}
	

}
