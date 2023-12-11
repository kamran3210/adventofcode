import * as fs from 'fs';

const input: string = fs.readFileSync('./day10/input.txt', 'utf-8').trim();

type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type Row = Tile[];
type Grid = Row[];
type Position = [row: number, col: number];
type Direction = 'N' | 'E' | 'S' | 'W';

const connectsTo = {
    north: new Set<Tile>(['|', 'L', 'J', 'S']),
    east: new Set<Tile>(['-', 'L', 'F', 'S']),
    south: new Set<Tile>(['|', '7', 'F', 'S']),
    west: new Set<Tile>(['-', 'J', '7', 'S']),
}

const [grid, start] = parseInput(input);

// BFS
let queue: [currPos: Position, step: number, prevPos?: Position][] = [[start, 0]]
while (queue.length) {
    const [currPos, step, prevPos] = queue.shift()!;
    // Reached the start again
    if (currPos[0] === start[0] && currPos[1] === start[1] && step > 0) {
        console.log(step / 2);
        break;
    }
    for (const nextPos of connectingPositions(currPos, grid, prevPos)) {
        queue.push([nextPos, step + 1, currPos]);
    }
}

function parseInput(input: string): [grid: Grid, start: Position] {
    const grid: Grid = [];
    const lines = input.split(/\r?\n/);
    let start: Position = [NaN, NaN];
    for (let row = 0; row < lines.length; row++) {
        grid.push(lines[row].trim().split('') as Row);
        const startCol = lines[row].indexOf('S');
        if (startCol >= 0) {
            start = [row, startCol];
        }
    }
    return [grid, start]
}

function canTilesConnect(a: Tile, b: Tile, dir: Direction): boolean {
    switch (dir) {
        case 'N':
            return connectsTo.north.has(a) && connectsTo.south.has(b);
        case 'E':
            return connectsTo.east.has(a) && connectsTo.west.has(b);
        case 'S':
            return connectsTo.south.has(a) && connectsTo.north.has(b);
        case 'W':
            return connectsTo.west.has(a) && connectsTo.east.has(b);
    }
}

function* connectingPositions(pos: Position, grid: Grid, prevPos?: Position) {
    const tile = getTile(pos, grid);
    const north: Position = [pos[0] - 1, pos[1]];
    if (canPositionsConnect(north, 'N')) {
        yield north;
    }
    const east: Position = [pos[0], pos[1] + 1];
    if (canPositionsConnect(east, 'E')) {
        yield east;
    }
    const south: Position = [pos[0] + 1, pos[1]];
    if (canPositionsConnect(south, 'S')) {
        yield south;
    }
    const west: Position = [pos[0], pos[1] - 1];
    if (canPositionsConnect(west, 'W')) {
        yield west;
    }

    function canPositionsConnect(nextPos: Position, dir: Direction) {
        return !(prevPos && arePositionsEqual(nextPos, prevPos)) &&
            isPositionValid(nextPos, grid) &&
            canTilesConnect(tile, getTile(nextPos, grid), dir)
    }
}

function isPositionValid(pos: Position, grid: Grid): boolean {
    return pos[0] >= 0 && pos[0] < grid.length &&
        pos[1] >= 0 && pos[1] < grid[0].length;
}

function getTile(pos: Position, grid: Grid) {
    return grid[pos[0]][pos[1]];
}

function arePositionsEqual(a: Position, b: Position) {
    return a[0] === b[0] && a[1] === b[1];
}
