const drawGrid = (canvas, ctx, offsetX, offsetY, dpr) => {


    const gridXOffset = offsetX % 10;
    const gridYOffset = offsetY % 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width / dpr; x += 10) {
      ctx.beginPath();
      ctx.strokeStyle = "#383c44";
      ctx.moveTo(x + gridXOffset, 0);
      ctx.lineTo(x + gridXOffset, canvas.height / dpr);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height / dpr; y += 10) {
      ctx.beginPath();
      ctx.strokeStyle = "#383c44";
      ctx.moveTo(0, y + gridYOffset);
      ctx.lineTo(canvas.width / dpr, y + gridYOffset);
      ctx.stroke();
    }
};

const drawAndGate = (ctx, x, y, selected=false) => {
  // Draw AND gate
  // Draw the AND gate body
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 30);
  ctx.lineTo(x + 40, y + 30);
  ctx.arcTo(x + 60, y + 30, x + 60, y + 50, 20);
  ctx.arcTo(x + 60, y + 70, x + 40, y + 70, 20);
  ctx.lineTo(x + 20, y + 70);
  ctx.closePath();
  ctx.strokeStyle = selected ? "#5ff" : "#55f";
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

const drawOrGate = (ctx, x, y, selected=false) => {
  // Draw OR gate
  // Draw the OR gate body
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 30);
  ctx.quadraticCurveTo(x + 30, y + 50, x + 20, y + 70);
  ctx.quadraticCurveTo(x + 40, y + 70, x + 60, y + 50);
  ctx.quadraticCurveTo(x + 40, y + 30, x + 20, y + 30);
  ctx.closePath();
  ctx.strokeStyle = selected ? "#5ff" : "#55f";
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


export { drawGrid, drawAndGate, drawOrGate };