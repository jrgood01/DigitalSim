import { v4 as uuidv4 } from 'uuid'; // Import UUID library

class BaseComponent {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.uuid = uuidv4();
        this.selected = false;
        this.width = width;
        this.height = height;

        this.inputMap = {};
        this.outputMap = {};

        this.inElement = this.inElement.bind(this);
    }

    CoordinatesToGrid = (x, y) => {
        return [Math.floor(x / 10) * 10, Math.floor(y / 10) * 10];
    }

    draw(ctx, userX, userY) {
        throw new Error('draw() must be implemented');
    }

    inElement(x, y) {
        const [mouseGridX, mouseGridY] = this.CoordinatesToGrid(x, y);
        const [elementGridX, elementGridY] = this.CoordinatesToGrid(this.x, this.y);
        return mouseGridX >= elementGridX && mouseGridX <= elementGridX + this.width && mouseGridY >= elementGridY && mouseGridY <= elementGridY + this.height;
    }

    inHitBox(x, y) {
        const hitBoxes = this.getHitBoxes();
        for (const hitBox of hitBoxes) {
            if (x >= hitBox.x && x <= hitBox.x + hitBox.width && y >= hitBox.y && y <= hitBox.y + hitBox.height) {
                return hitBox;
            }
        }
    }

    drawHitBox(ctx, hitbox) {
        ctx.beginPath();
        //Set stroke width
        ctx.lineWidth = 2;
        ctx.rect(hitbox.x - 5, hitbox.y - 5, 10, 10);
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    getElementName() {
        throw new Error('getName() must be implemented');
    }

    getHitBoxes() {
        throw new Error('getHitBoxes() must be implemented');
    }

    getHitBoxByTerminal(terminal, type) {
        throw new Error('getHitBoxByTerminal() must be implemented');
    }
}

class AndGateComponent extends BaseComponent {
    constructor(x, y) {
        super(x, y, 100, 70);
        //bind the draw function to the instance
        this.draw = this.draw.bind(this);
        this.move = this.move.bind(this);
        this.getName = this.getName.bind(this);
        this.getHitBoxes = this.getHitBoxes.bind(this);
        this.getHitBoxByTerminal = this.getHitBoxByTerminal.bind(this);
    }

    draw(ctx, userX, userY) {
        const [x, y] = this.CoordinatesToGrid(this.x, this.y);

        ctx.beginPath();
        ctx.moveTo(x + 20, y + 30);
        ctx.lineTo(x + 40, y + 30);
        ctx.arcTo(x + 60, y + 30, x + 60, y + 50, 20);
        ctx.arcTo(x + 60, y + 70, x + 40, y + 70, 20);
        ctx.lineTo(x + 20, y + 70);
        ctx.closePath();
        ctx.strokeStyle = this.selected ? "#5ff" : "#55f";
        ctx.lineWidth = 5;
        ctx.stroke();
      
        // Draw the input lines
        ctx.beginPath();
        ctx.moveTo(x, y + 40);
        ctx.lineTo(x + 20, y + 40);
        ctx.moveTo(x, y + 60);
        ctx.lineTo(x + 20, y + 60);
        ctx.stroke();
      
        // Draw the output line
        ctx.beginPath();
        ctx.moveTo(x + 60, y + 50);
        ctx.lineTo(x + 80, y + 50);
        ctx.stroke();
    }

    move(dx, dy) {

        this.x += dx;
        this.y += dy;
    }

    getName() {
        return 'AND';
    }

    getHitBoxes() {
        const [x, y] = this.CoordinatesToGrid(this.x, this.y);
        return [
            { x: x, y: y  + 40, width: 10, height: 10, type: 'input', terminal: 0},
            { x: x, y: y + 60, width: 10, height: 10, type: 'input', terminal: 1},
            { x: x + 80, y: y + 50, width: 10, height: 10, type: 'output', terminal: 0},
        ];
    }
}

export { AndGateComponent }