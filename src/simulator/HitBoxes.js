import { snapToGrid } from "./SimulationUtil.js"

const getGateHitBoxes = (x, y) => {
    return [
        { x: x, y: y  + 40, width: 10, height: 10, type: 'input', terminal: 0},
        { x: x, y: y + 60, width: 10, height: 10, type: 'input', terminal: 1},
        { x: x + 80, y: y + 50, width: 10, height: 10, type: 'output', terminal: 0},
    ];
}

const getConstHitBoxes = (x, y) => {
    return [
        {x: x + 80, y: y + 50, width: 10, height: 10, type: 'output', terminal: 0},
    ]
}

const drawHitBox = (ctx, x, y) => {
    const [coordX, coordY] = snapToGrid(x, y)
    ctx.beginPath();
    //Set stroke width
    ctx.lineWidth = 2;
    ctx.rect(coordX - 5, coordY - 5, 10, 10);
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
export { getGateHitBoxes, getConstHitBoxes, drawHitBox }