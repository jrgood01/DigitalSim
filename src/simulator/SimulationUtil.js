const mouseInRect = (x, y, x1, y1, x2, y2) => {
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

const snapToGrid = (x, y) => {
    return [Math.round(x / 10) * 10, Math.round(y / 10) * 10];
}
export { mouseInRect, snapToGrid };