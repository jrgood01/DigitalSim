import React, { useRef, useEffect, useState } from 'react';
import { drawGrid, drawAndGate, drawOrGate } from './SimulationRendering';
import { mouseInRect } from './SimulationUtil';

import './SimulationComponentStyle.css';
import { getGateHitBoxes, drawHitBox } from './HitBoxes';

function SimulationComponent(props) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);  // Add this line


  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);

  const [simulationState, setSimulationState] = useState([
        { type: 'and', x: 100, y: 100 },
        { type: 'or', x: 200, y: 200 }
   ]);
  
  const onMouseMove = (event) => {
    if (!ctxRef) return;
    //Get mouse x and y
    const x = event.clientX;
    const y = event.clientY;

    const canvasBounds = canvasRef.current.getBoundingClientRect();

    // Convert mouse x and y to canvas x and y
    const canvasX = (x - canvasBounds.left) * scale;
    const canvasY = (y - canvasBounds.top) * scale;

    drawState();
    for (const element of simulationState) {
        if (element.type == 'and' || element.type == 'or') {
            if (mouseInRect(canvasX, canvasY, element.x, element.y, element.x + 80, element.y + 70)) {
                const hitBoxes = getGateHitBoxes(element.x, element.y);
                for (const hitBox of hitBoxes) {
                    if (mouseInRect(canvasX, canvasY, hitBox.x, hitBox.y, hitBox.x + hitBox.width, hitBox.y + hitBox.height)) {
                        //draw red box
                        drawHitBox(ctxRef.current, hitBox.x, hitBox.y);
                    }
                }
            }
        }
    }
  }

  const drawState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;  // Add this line
    if (!ctxRef) return;

    const ctx = ctxRef.current;
    const dpr = window.devicePixelRatio || 1;

    //Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adjust canvas size for device pixel ratio
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    ctx.scale(dpr, dpr);
    drawGrid(canvas, ctx, offsetX, offsetY, dpr);

   for (const element of simulationState) {
        if (element.type == 'or') {
            drawOrGate(ctx, element.x, element.y);
        } else if (element.type == 'and') {
            drawAndGate(ctx, element.x, element.y);
        }
   }
  };

  useEffect(() => {
    //register mosue move event
    window.addEventListener('mousemove', onMouseMove);
    const resizeObserver = new ResizeObserver(drawState);
    resizeObserver.observe(canvasRef.current);
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d');
    }
    return () => {
      resizeObserver.unobserve(canvasRef.current);
    };
  }, []);

  useEffect(() => {
    drawState();
  }, [offsetX, offsetY]);

  return (
    <canvas ref={canvasRef} className='stage-container'></canvas>
  );
}

export default SimulationComponent;
