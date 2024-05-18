import { v4 as uuidv4 } from 'uuid';

class Wire {

    /***
     * Notes:
     *  - Wire contains a list of segments 
     *  - Each segment contains a start and end point
     *  - junctions are connections to other segments
     *  - componentConnections are connections to components
     *  - Each segment has a list of junctions
     *      - junction contains:
     *      -  x, y of junction
     *      -  connectedSegment of junction
     *      -  If connected segment is start or end
     *   -  When a segment is moved:
     *      - Update the location of the segment
     *      - Update new junction point
     *      - Run A* from the connected point of junction segment to the new junction point
     *      - Add the new segment to the wire
     * 
     *  - Data format:
     *  - junctions: {x, y, connectedSegmentUUID, isStart}
     *  - componentConnections: {x, y, componentUUID, terminal, isInput}
     */

    constructor(grid, segments) {
        this.grid = grid;
        this.segments = segments;
        this.drawingSegments = [];
        this.junctions = [];
        this.componentConnections = [];

        this.draw = this.draw.bind(this);
        this.addSegemnt = this.addSegemnt.bind(this);
    }

    draw(ctx) {
        for (const [uuid, segment] of Object.element(this.segments)) {
            ctx.beginPath();
            ctx.moveTo(segment.start[0], segment.start[1]);
            ctx.lineTo(segment.end[0], segment.end[1]);
            ctx.stroke();
        }

        // Draw circle junctions
        for (const junction of this.junctions) {
            ctx.beginPath();
            ctx.arc(junction.x, junction.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    addSegemnt(start, end) {
        this.segments[uuidv4()] = { start, end, junctions:[] };
    }

}

export default Wire;
