import React, { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { drawGrid } from './SimulationRendering';
import DrawGate from "./Graphics/GateGraphics";
import { mouseInRect, snapToGrid } from './SimulationUtil';
import './SimulationComponentStyle.css';
import { getGateHitBoxes, drawHitBox, getConstHitBoxes } from './HitBoxes';
import { drawNewWireTo, drawWire, updateWireRouting } from './Graphics/WireGraphics';
import { drawConst } from './Graphics/ConstGraphics';
import { getVal } from './LogicSimulator/SimulationGraph';

function SimulationComponent() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const currentHitbox = useRef(null);
  const currentHitboxGate = useRef(null);
  const currentDraggingWire = useRef(null);

  const mouseDown = useRef(false);

  const simulationStateRef = useRef({
    [uuidv4()]: { type: 'or', x: 100, y: 100, inputMap: {}, outputMap: {}, properties: {}, outputVals: [], updated: false, maxInputs: 2, maxOutputs: 1 },
    [uuidv4()]: { type: 'or', x: 400, y: 200, inputMap: {}, outputMap: {}, properties: {}, outputVals: [], updated: false, maxInputs: 2, maxOutputs: 1 },
    [uuidv4()]: { type: 'or', x: 400, y: 600, inputMap: {}, outputMap: {}, properties: {}, outputVals: [], updated: false, maxInputs: 2, maxOutputs: 1 },
    [uuidv4()]: { type: 'const', x: 600, y: 200, inputMap: {}, outputMap: {}, properties: { state: 1 }, outputVals: [], updated: false, maxInputs: 0, maxOutputs: 1 },
    [uuidv4()]: { type: 'const', x: 800, y: 200, inputMap: {}, outputMap: {}, properties: { state: 1 }, outputVals: [], updated: false, maxInputs: 0, maxOutputs: 1 },
    [uuidv4()]: { type: 'const', x: 1000, y: 200, inputMap: {}, outputMap: {}, properties: { state: 0 }, outputVals: [], updated: false, maxInputs: 0, maxOutputs: 1 },
    [uuidv4()]: { type: 'const', x: 1200, y: 200, inputMap: {}, outputMap: {}, properties: { state: 0 }, outputVals: [], updated: false, maxInputs: 0, maxOutputs: 1 }
  });

  const [, setRenderTrigger] = useState(false);
  const forceUpdate = () => setRenderTrigger(prev => !prev);

  const onSimulationTick = () => {
    for (const element of Object.values(simulationStateRef.current)) {
      element.updated = false;
    }

    for (const element of Object.values(simulationStateRef.current)) {
      if (element.type === 'wire') {
        getVal(simulationStateRef, element.uuid, 0);
      } else {
        for (const wire of Object.values(element.inputMap)) {
          getVal(simulationStateRef, wire.uuid, wire.outputs[0].terminal);
        }
      }
    }
  };

  const onMouseDown = (event) => {
    const disselect = !event.altKey;
    mouseDown.current = true;

    const [canvasX, canvasY] = convertToCanvasCoord(event.clientX, event.clientY);
    const [gridX, gridY] = snapToGrid(canvasX, canvasY);

    if (currentHitbox.current != null) {
      const newWireUuid = uuidv4();
      currentDraggingWire.current = {
        type: 'wire',
        segments: [{ 
            "startX": currentHitbox.current.x,
            "startY": currentHitbox.current.y, 
            "endX": currentHitbox.current.x, 
            "endY": currentHitbox.current.y,
            connectedTo: {
              elementUuid: currentHitbox.current.elementUuid,
              terminal: currentHitbox.current.terminal,
              terminalType: currentHitbox.current.type
            }}],
        inputs: [],
        outputs: [],
        wireVal: 3,
        uuid: newWireUuid
      };

      if (currentHitbox.current.type === 'output') {
        currentDraggingWire.current.inputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
        simulationStateRef.current[currentHitbox.current.elementUuid].outputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
      } else {
        currentDraggingWire.current.outputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
        simulationStateRef.current[currentHitbox.current.elementUuid].inputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
      }

      simulationStateRef.current[newWireUuid] = currentDraggingWire.current;
      forceUpdate();
      return;
    }

    for (const element of Object.values(simulationStateRef.current)) {
      if (element.type === 'and' || element.type === 'or' || element.type === 'const') {
        if (mouseInRect(gridX, gridY, element.x, element.y, element.x + 80, element.y + 70)) {
          element.selected = true;
        } else if (disselect) {
          element.selected = false;
        }
      }
    }
    forceUpdate();
  };

  const onMouseUp = () => {
    if (currentDraggingWire.current != null && currentHitbox.current != null) {
      if (currentHitbox.current.type === 'output') {
        currentDraggingWire.current.inputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
        simulationStateRef.current[currentHitbox.current.elementUuid].outputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
      } else {
        currentDraggingWire.current.outputs.push({ terminal: currentHitbox.current.terminal, elementUuid: currentHitbox.current.elementUuid });
        simulationStateRef.current[currentHitbox.current.elementUuid].inputMap[currentHitbox.current.terminal] = currentDraggingWire.current;
      }
      drawNewWireTo(currentDraggingWire.current, currentHitbox.current.x, currentHitbox.current.y);
        currentDraggingWire.current.segments[currentDraggingWire.current.segments.length - 1].connectedTo = {
          elementUuid: currentHitbox.current.elementUuid,
          terminal: currentHitbox.current.terminal,
          terminalType: currentHitbox.current.type
        };
    }
    
    forceUpdate();
    console.log(simulationStateRef.current);

    mouseDown.current = false;
    currentHitbox.current = null;
    currentHitboxGate.current = null;
    currentDraggingWire.current = null;
  };

  const onMouseMove = (event) => {
    if (!ctxRef.current) return;

    const [canvasX, canvasY] = convertToCanvasCoord(event.clientX, event.clientY);

    drawState();
    currentHitbox.current = null;
    currentHitboxGate.current = null;

    if (currentDraggingWire.current != null) {
      drawNewWireTo(currentDraggingWire.current, canvasX, canvasY);
    }

    for (const [uuid, element] of Object.entries(simulationStateRef.current)) {
      if (element.selected && mouseDown.current) {
        element.x += event.movementX;
        element.y += event.movementY;

        // Update routing of wires connected to this element
        updateWireRouting(simulationStateRef.current, element, uuid);
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
  };

  const convertToCanvasCoord = (x, y) => {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const canvasX = x - canvasBounds.left;
    const canvasY = y - canvasBounds.top;
    return [canvasX, canvasY];
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
      if (element.type === 'or' || element.type === 'and') {
        DrawGate(element.type, ctx, element.x, element.y, element.selected);
      } else if (element.type === 'const') {
        drawConst(ctx, element.x, element.y, element.properties.state, element.properties.selected);
      } else if (element.type === 'wire') {
        drawWire(ctx, element);
      } else {
        console.error(`Invalid element type: ${element.type}`);
      }
    }
  };

  useEffect(() => {
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
    return () => {
      resizeObserver.unobserve(canvasRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className='stage-container'></canvas>
  );
}

export default SimulationComponent;
