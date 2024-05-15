const getGateHitBoxes = (x, y) => {
    return [
        { x: x - 5, y: y + 35, width: 10, height: 10, type: 'input' },
        { x: x - 5, y: y + 55, width: 10, height: 10, type: 'input' },
        { x: x + 75, y: y + 45, width: 10, height: 10, type: 'input' },
    ];
}

const drawHitBox = (ctx, x, y) => {
    ctx.beginPath();
    //Set stroke width
    ctx.lineWidth = 2;
    ctx.rect(x, y, 10, 10);
    ctx.strokeStyle = 'red';
    ctx.stroke();
}
export { getGateHitBoxes, drawHitBox }