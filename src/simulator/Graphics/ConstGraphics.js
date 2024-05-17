import { snapToGrid } from "../SimulationUtil";

function drawConst(ctx, x, y, state, selected=false) {
    const [gridX, gridY] = snapToGrid(x, y)
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(gridX, gridY + 50);
    ctx.lineTo(gridX + 80, gridY + 50);
    ctx.strokeStyle = state === 0 ?  "#272" : "#5f5";
    ctx.lineWidth = 5;
    ctx.stroke();
    // Draw the rectangle
    ctx.fillStyle = state === 0 ?  "#272" : "#5f5";
    ctx.fillRect(gridX, gridY + 25, 50, 50);
  
    // Draw the text
    ctx.fillStyle = '#333';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state === 0 ? '0' : '1', x + 25, gridY + 50);
  }

export {drawConst}