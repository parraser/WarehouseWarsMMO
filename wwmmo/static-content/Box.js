module.exports = class Box {

	constructor (x,y,icon){
		this.x = x;
		this.y = y;
		this.icon = icon;
	}
	getPosition() {
		return [this.x, this.y];
	}

	getIcon() {
		return this.icon;
	}

	getType() {
		return 'box';
	}
	isDead() {
		return this.dead;
	}

	move(direction, field, drawBoard) {
		for (var i = 0; i < field.length; i++) {
			var item = field[i];
			var x = item.getPosition()[0];
			var y = item.getPosition()[1];
			if (this.x + direction[0] == x && this.y + direction[1] == y) {
				if (item.getType() == 'box') {
					if (item.move(direction, field, drawBoard)) {}
					else {return false;}
				}
				else if (item.getType() == 'wall')
					return false;
			}
		}
		if (this.x + direction[0] < 0 || this.x + direction[0] > 20){return false;}
		if (this.y + direction[1] < 0 || this.y + direction[1] > 20){return false;}

		this.y += direction[1];
		this.x += direction[0];
		drawBoard[this.x][this.y] = this.icon;
		return true;
	}
}