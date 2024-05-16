import { drawAndGate, drawOrGate } from '../SimulationRendering';
import { snapToGrid } from '../SimulationUtil';

export default function DrawGate(gateType, ctx, x, y, selected) {
    const [coordX, coordY] = snapToGrid(x, y)
    if (gateType === 'or') {
        drawOrGate(ctx, coordX, coordY, selected);
    } else if (gateType === 'and') {
        drawAndGate(ctx, coordX, coordY, selected);
    }
}