const King = require('./King');

const roiBlanc = new King('white', 4, 0);
const position = roiBlanc.getPosition();
const color = roiBlanc.getColor();
if (color != 'white') {console.error('bad color : expected white, got ' + color);}
if (position.x !== 4) {console.error('bad x : expected 4, got ' + position.x);}
if (position.y !== 0) {console.error('bad x : expected 0, got ' + position.y);}

console.log('Le roi blanc est en ' + roiBlanc.getPositionAlpha());
console.log('On déplace le roi en h8');
roiBlanc.setPositionAlpha("h8");
console.log('Le roi est en ', roiBlanc.getPosition());
console.log('Le roi est en ' + roiBlanc.getPositionAlpha());
