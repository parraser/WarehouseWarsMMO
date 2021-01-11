module.exports = class Blank {

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
		return 'blank';
	}
}