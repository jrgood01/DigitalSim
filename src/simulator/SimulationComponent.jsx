import React, { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { drawGrid } from './SimulationRendering';
import DrawGate from "./Graphics/GateGraphics"
import { mouseInRect, snapToGrid } from './SimulationUtil';
import './SimulationComponentStyle.css';
import { getGateHitBoxes, drawHitBox, getConstHitBoxes } from './HitBoxes';
import { drawNewWireTo, drawWire } from './Graphics/WireGraphics';
import { drawConst } from './Graphics/ConstGraphics';

function SimulationComponent(props) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const currentHitbox = useRef(null);
  const currentHitboxGate = useRef(null);
  const currentDraggingWire = useRef(null);

  const mouseDown = useRef(false);

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);

  /*
    Simulation elements values:
      type: gate type
      x : x location
      y : y location
      InputMap (for elemnts) : input map stored as key value pair where key is terminal and value is wire uuid
      OutputMap (for elemnts) : output map stored as key value pair where key is terminal and value is wire uuid
      segments (for wire) : wire segments
      inputs (for wire) : wire inputs stored as key value pair where key is terminal and value is element uuid
      outputs (for wire) : wire outputs stored as key value pair where key is terminal and value is element uuid
      wireVal (for wire) : value on wire [-1 : error, 0 : false, 1 : true]

  */
  const [simulationState, setSimulationState] = useState({
    [uuidv4()]: { type: 'and', x: 100, y: 100, inputMap: {}, outputMap: {}, properties:{}, outputVals:[0]},
    [uuidv4()]: { type: 'or', x: 400, y: 200, inputMap: {}, outputMap: {}, properties:{}, outputVals:[0]},
    [uuidv4()]: { type: 'const', x: 600, y: 200, inputMap: {}, outputMap: {}, properties:{state:1}, outputVals:[0]}
  });

  const onMouseDown = (event) => {
    let disselect = true;
    if (event.altKey) {
      disselect = false;
    }

    mouseDown.current = true;
    const [canvasX, canvasY] = ConvertToCanvasCoord(event.clientX, event.clientY);
    const [gridX, gridY] = snapToGrid(canvasX, canvasY);
    if (currentHitbox.current != null) {
      const newWireUuid = uuidv4();
      currentDraggingWire.current = {
        type: 'wire',
        segments: [{"startX": currentHitbox.current.x, "startY": currentHitbox.current.y, "endX": currentHitbox.current.x, "endY": currentHitbox.current.y}],
        inputs: [],
        outputs: [],
        wireVal: 3
      };

      if (currentHitbox.current.type === 'output') {
        currentDraggingWire.current.inputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
        simulationState[currentHitbox.current.elementUuid].outputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
      } else {
        currentDraggingWire.current.outputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
        simulationState[currentHitbox.current.elementUuid].inputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
      }

      setSimulationState(prevState => ({
        ...prevState,
        [newWireUuid]: currentDraggingWire.current
      }));
      return;
    }

    for (const uuid in simulationState) {
      const element = simulationState[uuid];
      if (element.type === 'and' || element.type === 'or') {
        if (mouseInRect(gridX, gridY, element.x, element.y, element.x + 80, element.y + 70)) {
          element.selected = true;
        } else if (disselect) {
          element.selected = false;
        }
      }
    }
    setSimulationState({ ...simulationState });
  }

  const onMouseUp = (event) => {
    if (currentDraggingWire.current != null) {
      if (currentHitbox.current != null) {
        if (currentHitbox.current.type === 'output') {
          currentDraggingWire.current.inputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
          simulationState[currentHitbox.current.elementUuid].outputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
        } else {
          currentDraggingWire.current.outputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
          simulationState[currentHitbox.current.elementUuid].inputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
        }
      }
    }
    console.log(simulationState)
    mouseDown.current = false;
    currentHitbox.current = null;
    currentHitboxGate.current = null;
    currentDraggingWire.current = null;
  }

  const onMouseMove = (event) => {
    if (!ctxRef.current) return;

    const [canvasX, canvasY] = ConvertToCanvasCoord(event.clientX, event.clientY);

    drawState();
    currentHitbox.current = null;
    currentHitboxGate.current = null;
    if (currentDraggingWire.current != null) {
      drawNewWireTo(currentDraggingWire.current, canvasX, canvasY);
    }
    for (const uuid in simulationState) {
      const element = simulationState[uuid];
        if (element.selected && mouseDown.current) {
          element.x += event.movementX;
          element.y += event.movementY;
        }
        if (mouseInRect(canvasX, canvasY, element.x, element.y, element.x + 100, element.y + 70)) {
          let hitBoxes;
          if (element.type === "and" || element.type === "or") {
            hitBoxes = getGateHitBoxes(element.x, element.y);
          } else if (element.type === "const") {
            hitBoxes = getConstHitBoxes(element.x, element.y);
          }

          for (const hitBox of hitBoxes) {
            if (mouseInRect(canvasX, canvasY, hitBox.x, hitBox.y, hitBox.x + hitBox.width, hitBox.y + hitBox.height)) {
              drawHitBox(ctxRef.current, hitBox.x, hitBox.y);
              currentHitbox.current = hitBox;
              hitBox.elementUuid = uuid;
              currentHitboxGate.current = element;
            }
          }
      }
    }
  }

  const ConvertToCanvasCoord = (x, y) => {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const canvasX = (x - canvasBounds.left) * scale;
    const canvasY = (y - canvasBounds.top) * scale;
    return [canvasX, canvasY];
  }

  const drawState = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    ctx.scale(dpr, dpr);
    drawGrid(canvas, ctx, offsetX, offsetY, dpr);

    for (const uuid in simulationState) {
      const element = simulationState[uuid];
      if (element.type === 'or' || element.type === 'and') {
        DrawGate(element.type, ctx, element.x, element.y, element.selected);
      } else if (element.type === 'const') {
        drawConst(ctx, element.x, element.y, element.properties.state, element.properties.selected)
      } else if (element.type === 'wire') {
        drawWire(ctx, element);
      } else {
        console.error(`Invalid element type: ${element.type}`)
      }
    }
  };

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
    return () => {
      resizeObserver.unobserve(canvasRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [simulationState]);

  return (
    <canvas ref={canvasRef} className='stage-container'></canvas>
  );
}

export default SimulationComponent;
