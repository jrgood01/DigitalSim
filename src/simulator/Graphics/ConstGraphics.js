function drawConst(ctx, x, y, state, selected=false) {
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x + 80, y + 50);
    ctx.strokeStyle = state === 0 ?  "#272" : "#5f5";
    ctx.lineWidth = 5;
    ctx.stroke();
    // Draw the rectangle
    ctx.fillStyle = state === 0 ?  "#272" : "#5f5";
    ctx.fillRect(x, y + 25, 50, 50);
  
    // Draw the text
    ctx.fillStyle = '#333';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state === 0 ? '0' : '1', x + 25, y + 50);
  }

export {drawConst}