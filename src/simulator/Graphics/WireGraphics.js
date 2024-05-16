import { snapToGrid } from "../SimulationUtil";

function drawWire(ctx, element) {
    // Loop through segments
    let color;
    /*
    0 : low
    1 : high
    2 : error
    3 : float
    */
    if (element.wireVal === 0) {
        color = "#272";
    } else if (element.wireVal === 1) {
        color = "#5f5";
    } else if (element.wireVal === 2) {
        color = "#f33";
    } else {
        color = "#444";
    }

    for (const segment of element.segments) {
        ctx.beginPath();

        let x1 = segment.startX;
        let y1 = segment.startY;
        let x2 = segment.endX;
        let y2 = segment.endY;
        
        const [gridX1, gridY1] = snapToGrid(x1, y1);
        const [gridX2, gridY2] = snapToGrid(x2, y2);
        ctx.moveTo(gridX1, gridY1);
        ctx.lineTo(gridX2, gridY2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

function drawNewWireTo(wire, x, y) {
    if (wire.segments.length === 1) {
        wire.segments.push({
            startX: 100,
            startY: 100,
            endX: 100,
            endY: 100
        });
    }

    const startX = wire.segments[0].startX;
    const startY = wire.segments[0].startY;

    const [gridStartX, gridStartY] = snapToGrid(startX, startY);
    const [gridX, gridY] = snapToGrid(x, y);
    // Draw a two segment elbow joint from (startX, startY) to (x, y)
    if (Math.abs(startX - gridX) > Math.abs(gridStartY - gridY)) {
        // If the horizontal distance is greater, draw the horizontal segment first
        wire.segments[0] = { startX: gridStartX, startY: gridStartY, endX: gridX, endY: gridStartY };
        wire.segments[1] = { startX: gridX, startY: gridStartY, endX: gridX, endY: gridY };
    } else {
        // If the vertical distance is greater, draw the vertical segment first
        wire.segments[0] = { startX: gridStartX, startY: gridStartY, endX: gridStartX, endY: gridY };
        wire.segments[1] = { startX: gridStartX, startY: gridY, endX: gridX, endY: gridY };
    }
}

export { drawWire, drawNewWireTo };
