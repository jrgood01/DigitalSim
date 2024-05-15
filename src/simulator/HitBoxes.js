const getGateHitBoxes = (x, y) => {
    return [
        { x: x - 5, y: y + 35, width: 10, height: 10, type: 'input' },
        { x: x - 5, y: y + 55, width: 10, height: 10, type: 'input' },
        { x: x + 75, y: y + 45, width: 10, height: 10, type: 'input' },
    ];
}

export { getGateHitBoxes}