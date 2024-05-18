import PriorityQueue from 'js-priority-queue';

class SimulationGrid {
    constructor(maxWidth = 5000, maxHeight = 5000, spacing = 10) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.spacing = spacing;
        this.registeredComponents = {};

        this.grid = this.createGrid();

        this.snapToGrid = this.snapToGrid.bind(this);
        this.placeComponent = this.placeComponent.bind(this);
        this.drawGridTaken = this.drawGridTaken.bind(this);
        this.aStar = this.aStar.bind(this);
        this.runAstarAndJoinSegments = this.runAstarAndJoinSegments.bind(this);
    }

    createGrid() {
        const grid = [];
        for (let x = 0; x < this.maxWidth; x += this.spacing) {
            const row = [];
            for (let y = 0; y < this.maxHeight; y += this.spacing) {
                row.push(null);
            }
            grid.push(row);
        }
        return grid;
    }

    snapToGrid(x, y) {
        const gridX = Math.floor(x / this.spacing) * this.spacing;
        const gridY = Math.floor(y / this.spacing) * this.spacing;
        return [gridX, gridY];
    }

    toGridCoordinates(x, y) {
        return [Math.floor(x / this.spacing), Math.floor(y / this.spacing)];
    }

    placeComponent(component) {
        const componentWidth = component.width / this.spacing;
        const componentHeight = component.height / this.spacing;
        const x = Math.round(component.x / this.spacing);
        const y = Math.round(component.y / this.spacing);

        if (this.registeredComponents[component.uuid]) {
            // Clear the old component
            const [oldX, oldY, oldWidth, oldHeight] = this.registeredComponents[component.uuid];
            for (let i = oldX; i < oldX + oldWidth; i++) {
                for (let j = oldY; j < oldY + oldHeight; j++) {
                    this.grid[i][j] = null;
                }
            }
        }

        // Update the registered component position
        this.registeredComponents[component.uuid] = [x, y, componentWidth, componentHeight];

        // Set Component coordinates on the grid
        for (let i = x; i < x + componentWidth; i++) {
            for (let j = y; j < y + componentHeight; j++) {
                this.grid[i][j] = component.uuid;
            }
        }
    }

    aStar(x1, y1, x2, y2, okUUIDs = new Set()) {
        const [startX, startY] = this.toGridCoordinates(x1, y1);
        const [endX, endY] = this.toGridCoordinates(x2, y2);
        const visited = new Set();
        const queue = new PriorityQueue({ comparator: (a, b) => a[2] - b[2] });
    
        const heuristic = (x, y) => Math.abs(x - endX) + Math.abs(y - endY);
        queue.queue([startX, startY, 0, 0, null, []]);
    
        while (queue.length > 0) {
            const [x, y, cost, priority, lastDirection, path] = queue.dequeue();
            if (x === endX && y === endY) {
                return path.concat([[endX, endY]]);
            }
            if (visited.has(`${x},${y}`)) {
                continue;
            }
            visited.add(`${x},${y}`);
            const neighbors = [
                [x + 1, y, 'right'],
                [x - 1, y, 'left'],
                [x, y + 1, 'down'],
                [x, y - 1, 'up'],
            ];
            for (const [nx, ny, direction] of neighbors) {
                if (nx < 0 || nx >= this.maxWidth / this.spacing || ny < 0 || ny >= this.maxHeight / this.spacing) {
                    continue;
                }
                if (this.grid[nx][ny] !== null && !okUUIDs.has(this.grid[nx][ny])) {
                    continue;
                }
                const directionChangePenalty = (lastDirection && lastDirection !== direction) ? 1 : 0;
                const newCost = cost + 1 + directionChangePenalty;
                const newPriority = newCost + heuristic(nx, ny);
                queue.queue([nx, ny, newCost, newPriority, direction, [...path, [x, y]]]);
            }
        }
        console.log('No path found')
        return null;
    }

    drawGridTaken(ctx) {
        for (let x = 0; x < this.maxWidth; x += this.spacing) {
            for (let y = 0; y < this.maxHeight; y += this.spacing) {
                if (this.grid[x / this.spacing][y / this.spacing]) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(x, y, this.spacing, this.spacing);
                }
            }
        }
    }

    runAstarAndJoinSegments(x1, y1, x2, y2, okUUIDs = new Set()) {
        const path = this.aStar(x1, y1, x2, y2, okUUIDs);
        if (!path) {
            return null;
        }
        const segments = [];
        let start = path[0];
        let direction = null;  // "horizontal" or "vertical"

        for (let i = 1; i < path.length; i++) {
            const [x, y] = path[i];
            const [prevX, prevY] = path[i - 1];
            const newDirection = (x === prevX) ? "vertical" : "horizontal";

            if (direction && newDirection !== direction) {
                segments.push([start[0], start[1], prevX, prevY]);
                start = [prevX, prevY];
            }

            direction = newDirection;
            if (i === path.length - 1) {
                segments.push([start[0], start[1], x, y]);
            }
        }
        console.log(segments)
        return segments.map(([x1, y1, x2, y2]) => {
            return [x1 * this.spacing, y1 * this.spacing, x2 * this.spacing, y2 * this.spacing];
        });
    }
}

export default SimulationGrid;
