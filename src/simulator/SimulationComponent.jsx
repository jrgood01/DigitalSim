import React, { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { drawGrid } from './SimulationRendering';
import './SimulationComponentStyle.css';
import { AndGateComponent } from './components/BaseComponent';
import SimulationGrid from './SimulationGrid';
import Wire from './Wire';

function SimulationComponent() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const currentHitbox = useRef(null);
  const currentHitboxElement = useRef(null);

  const curHoverElement = useRef(null);

  const curSelectedElements = useRef([]);
  const simulationGrid = useRef(new SimulationGrid());

  const mouseDown = useRef(false);

  const simulationStateRef = useRef({
    [uuidv4()]: new AndGateComponent(400, 100),
  });

  const [renderTrigger, setRenderTrigger] = useState(false);
  const forceUpdate = () => setRenderTrigger(prev => !prev);

  const onSimulationTick = () => {
    // Your simulation tick logic here
  };

  const onMouseDown = (event) => {
    mouseDown.current = true;
    // if alt key not pressed, clear selected elements
    if (!event.altKey) {
      for (const element of curSelectedElements.current) {
        console.log(element);
        element.selected = false;
        
      }
      curSelectedElements.current = []

      if (currentHitboxElement.current) {
        
      }
    }

    if (curHoverElement.current) {
      curHoverElement.current.selected = true;
      curSelectedElements.current.push(curHoverElement.current);
    }

    forceUpdate();
  };

  const onMouseUp = () => {
    mouseDown.current = false;
    if (curSelectedElements.current.length > 0) {
      for (const element of curSelectedElements.current) {
        simulationGrid.current.placeComponent(element);
        simulationGrid.current.drawGridTaken(ctxRef.current);
        /*
        const segments = simulationGrid.current.runAstarAndJoinSegments(0, 0, 500, 700)

        const wire = new Wire(
          segments.map(([x1, y1, x2, y2]) => ({
            start: [x1, y1],
            end: [x2, y2],
          }))
        );
        wire.draw(ctxRef.current);
        */
      }
    }
  };

  const ConvertToCanvasCoord = (x, y) => {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const canvasX = (x - canvasBounds.left);
    const canvasY = (y - canvasBounds.top);
    return [canvasX, canvasY];
  };

  const onMouseMove = (event) => {
    curHoverElement.current = null;

    if (!mouseDown) {
      currentHitbox.current = null;
      currentHitboxElement.current = null;
    }

    let update = false;

    const [x, y] = ConvertToCanvasCoord(event.clientX, event.clientY);
    for (const element of Object.values(simulationStateRef.current)) {
      // Check for mouse collision with elements and hitboxes
      // ==============================================================
      if (element.inElement(x, y)) {
        const hitbox = element.inHitBox(x, y);
        if (element.inHitBox(x, y)) {
          element.drawHitBox(ctxRef.current, hitbox);
          currentHitbox.current = hitbox;
          currentHitboxElement.current = element;
        } else {
          curHoverElement.current = element;
          update = true;
        }
      }
      // ==============================================================
    }
    if (mouseDown.current) {
      for (const element of curSelectedElements.current) {
        // call move(dx, dy) on each selected element
        element.move(event.movementX, event.movementY);
        update = true;
      }
    }

    if (update) {
      forceUpdate();
    }
  };

  const drawState = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    ctx.scale(dpr, dpr);
    drawGrid(canvas, ctx, 0, 0, dpr);

    for (const element of Object.values(simulationStateRef.current)) {
      element.draw(ctx);
    }
  };

  useEffect(() => {
    const addWire = new Wire(simulationGrid.current, [])
    const intervalId = setInterval(onSimulationTick, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(drawState);
    resizeObserver.observe(canvasRef.current);
    const canvas = canvasRef.current;

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    if (canvas) {
      ctxRef.current = canvas.getContext('2d');
    }

    for (const element of Object.values(simulationStateRef.current)) {
      simulationGrid.current.placeComponent(element);
    }

    return () => {
      resizeObserver.unobserve(canvasRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  useEffect(() => {
    drawState();
  }, [renderTrigger]);

  return (
    <canvas ref={canvasRef} className='stage-container'></canvas>
  );
}

export default SimulationComponent;
