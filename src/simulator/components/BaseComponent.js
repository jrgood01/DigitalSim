class BaseComponent {
    constructor(ctx, x, y, width, height) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.selected = false;
        this.width = width;
        this.height = height;

        this.inputMap = {};
        this.outputMap = {};
    }

    draw(ctx) {
        throw new Error('draw() must be implemented');
    }

    move(dx, dy) {
        throw new Error('draw() must be implemented');
    }

    getName() {
        throw new Error('getName() must be implemented');
    }

    getHitBoxes() {
        throw new Error('getHitBoxes() must be implemented');
    }
    
    addInput(terminal, wire) {
        this.inputMap[terminal] = wire;
        wire.addOutput(terminal, this);
    }

    addOutput(terminal, wire) {
        this.outputMap[terminal] = wire;
        wire.addInput(terminal, this);
    }
}