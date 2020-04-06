const King = require('./King');

const roiBlanc = new King('white', 4, 0);
const position = roiBlanc.getPosition();
const color = roiBlanc.getColor();
const name = roiBlanc.getName();
const move = 'h8';
if (color != 'white') {console.error('bad color : expected white, got ' + color);}
if (position.x !== 4) {console.error('bad x : expected 4, got ' + position.x);}
if (position.y !== 0) {console.error('bad y : expected 0, got ' + position.y);}
if (name !== 'King') {console.error('bad name : expected King, got ' + name);}

console.log('Nature de la pièce : ' + roiBlanc.getName());
console.log('Couleur de la pièce : ' + roiBlanc.getColor());
console.log('La pièce est en ' + roiBlanc.getPositionB());
console.log('Déplacement de la pièce en ' + move);
roiBlanc.setPositionB(move);
console.log('La pièce est en ', roiBlanc.getPosition());
console.log('La pièce est en ' + roiBlanc.getPositionB());
console.log('Déplacements possibles de la pièce en', roiBlanc.getPositionB(), ':');
console.log(roiBlanc.getMoveList(new Board));
