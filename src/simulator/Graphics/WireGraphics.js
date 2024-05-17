import { getHitBoxes } from "../HitBoxes";
import { snapToGrid } from "../SimulationUtil";

// Function to draw existing wires
function drawWire(ctx, element) {
  // Determine wire color based on value
  let color;
  if (element.wireVal === 0) {
    color = "#272";
  } else if (element.wireVal === 1) {
    color = "#5f5";
  } else if (element.wireVal === 2) {
    color = "#f33";
  } else {
    color = "#444";
  }

  // Draw each segment of the wire
  for (const segment of element.segments) {
    ctx.beginPath();

    const [gridX1, gridY1] = snapToGrid(segment.startX, segment.startY);
    const [gridX2, gridY2] = snapToGrid(segment.endX, segment.endY);

    ctx.moveTo(gridX1, gridY1);
    ctx.lineTo(gridX2, gridY2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

// Function to draw a new wire to the specified coordinates
function drawNewWireTo(wire, x, y) {
  if (wire.segments.length === 1) {
    wire.segments.push({
      startX: 100,
      startY: 100,
      endX: 100,
      endY: 100
    });
  }

  const lastSegment = wire.segments.length - 1;
  const secondToLastSegment = wire.segments.length - 2;

  const startX = wire.segments[secondToLastSegment].startX;
  const startY = wire.segments[secondToLastSegment].startY;

  const [gridStartX, gridStartY] = snapToGrid(startX, startY);
  const [gridX, gridY] = snapToGrid(x, y);
  if (Math.sqrt((gridStartX - gridX) ** 2 + (gridStartY - gridY) ** 2) < 90) {
    // Create Manhattan (rectilinear) routing with horizontal and vertical segments
    if (Math.abs(gridStartX - gridX) > Math.abs(gridStartY - gridY)) {
      // If horizontal distance is greater, draw horizontal segment first
      wire.segments[secondToLastSegment] = { startX: gridStartX, startY: gridStartY, endX: gridX, endY: gridStartY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
      wire.segments[lastSegment] = { startX: gridX, startY: gridStartY, endX: gridX, endY: gridY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
    } else {
      // If vertical distance is greater, draw vertical segment first
      wire.segments[secondToLastSegment] = { startX: gridStartX, startY: gridStartY, endX: gridStartX, endY: gridY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
      wire.segments[lastSegment] = { startX: gridStartX, startY: gridY, endX: gridX, endY: gridY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
    }
  } else {
    console.log("Wire: ", wire)
    // if segment 0 is x direction
    if (wire.segments[secondToLastSegment].endX !== wire.segments[secondToLastSegment].startX) {
      wire.segments[secondToLastSegment] = { startX: gridStartX, startY: gridStartY, endX: gridX, endY: gridStartY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
      wire.segments[lastSegment] = { startX: gridX, startY: gridStartY, endX: gridX, endY: gridY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
    } else {
      wire.segments[secondToLastSegment] = { startX: gridStartX, startY: gridStartY, endX: gridStartX, endY: gridY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
      wire.segments[lastSegment] = { startX: gridStartX, startY: gridY, endX: gridX, endY: gridY, connectedTo: wire.segments[secondToLastSegment].connectedTo};
    }
  }
}

// Function to update wire routing when components move
function updateWireRouting(simulationState, element, elementUuid) {
    const hitBoxes = getHitBoxes(element.type, element.x, element.y);
    console.log(hitBoxes);
    for (const [terminal, wire] of Object.entries(element.inputMap)) {
        for (const segment of wire.segments) {
            if (segment.connectedTo && segment.connectedTo.elementUuid === elementUuid) {
                const hitBox = hitBoxes.find(hitBox => hitBox.terminal === parseInt(terminal) && hitBox.type === segment.connectedTo.terminalType);
                const [segmentStartX, segmentStartY] = snapToGrid(segment.startX, segment.startY);
                const [segmentEndX, segmentEndY] = snapToGrid(segment.endX, segment.endY);
                const [hitBoxX, hitBoxY] = snapToGrid(hitBox.x, hitBox.y);
                if (hitBox) {
                    if (segmentStartY === segmentEndY && segmentEndY === hitBoxY) {
                        // extend horizontal segment
                        segment.endX = hitBoxX;
                    } else if (segmentStartX === segmentEndX && segmentEndX === hitBoxX) {
                        // extend vertical segment
                        segment.endY = hitBoxY;
                    } else {
                        // Create a new segment to connect to the hitbox
                        wire.segments.push({
                            startX: segment.endX,
                            startY: segment.endY,
                            endX: hitBoxX,
                            endY: hitBoxY,
                            connectedTo: segment.connectedTo
                        });
                        segment.connectedTo = null;
                        // Update the existing segment to end at the turning point
                        if (segmentStartY === segmentEndY) {
                            segment.endX = hitBoxX;
                        } else {
                            segment.endY = hitBoxY;
                        }
                    }
                }
            }
        }
    }
}

export { drawWire, drawNewWireTo, updateWireRouting };
