import * as fs from 'fs';

const input: string = fs.readFileSync('./day10/input.txt', 'utf-8').trim();

type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type Row = Tile[];
type Grid = Row[];
type Position = { row: number, col: number };
type Direction = 'N' | 'E' | 'S' | 'W';

const connectsTo = {
    north: new Set<Tile>(['|', 'L', 'J', 'S']),
    east: new Set<Tile>(['-', 'L', 'F', 'S']),
    south: new Set<Tile>(['|', '7', 'F', 'S']),
    west: new Set<Tile>(['-', 'J', '7', 'S']),
}

const [grid, start] = parseInput(input);
const boundaries = getLoop();
// Test loop is correct
const cleanGrid = Array<string[]>(grid.length).fill([]).map(_ => (Array<string>(grid[0].length).fill('.')));
for (const pos of boundaries) {
    const [row, col] = pos.split(',').map(Number);
    cleanGrid[row][col] = grid[row][col];
}

let area = 0;
for (let row = 0; row < grid.length; row++) {
    let intersections = 0;
    let lastInterected: string = '';
    for (let col = 0; col < grid[0].length; col++) {
        const tile = grid[row][col];
        const pos = { row, col } as Position;
        const isBoundary = boundaries.has(posToString(pos));
        if (isBoundary) {
            // Crossing a vertical line (or a horizontal line thats part of two vertical sections)
            if (
                tile === '|' ||
                (tile === '7' && lastInterected === 'L') ||
                (tile === 'J' && lastInterected === 'F')
            ) {
                intersections++;
            }
            // Crossing a vertical U turn
            else if (tile === 'L' || tile === 'F') {
                lastInterected = tile;
            }
        }
        else if (!isBoundary) {
            if (intersections % 2 === 1) {
                cleanGrid[row][col] = 'I';
                area++;
            } else {
                cleanGrid[row][col] = 'O';
            }
        }
    }
}
console.log('\nInside and Outside');
for (const line of cleanGrid) {
    console.log(line.join(''));
}
console.log(area);

function getLoop() {
    // DFS
    let stack: [currPos: Position, step: number, prevPos?: Position][] = [[start, 0]]
    let loop: string[] = []
    while (stack.length) {
        const [currPos, step, prevPos] = stack.pop()!;
        loop = loop.slice(0, step);
        // Reached the start again
        if (arePositionsEqual(currPos, start) && step > 0) {
            break;
        }
        loop.push(posToString(currPos));
        for (const nextPos of connectingPositions(currPos, grid, prevPos)) {
            stack.push([nextPos, step + 1, currPos]);
        }
    }
    const firstStep = stringToPos(loop[1]);
    const lastStep = stringToPos(loop[loop.length - 1]);
    const firstStepDir = getDirection(start, firstStep)!;
    const lastStepDir = getDirection(start, lastStep)!;
    const dir1 = getConnectsToByDirection(firstStepDir)!;
    const dir2 = getConnectsToByDirection(lastStepDir)!;
    dir1
    const intersection = new Set([...dir1].filter(i => dir2.has(i)));
    intersection.delete('S');
    const startTile = [...intersection.values()][0];
    grid[start.row][start.col] = startTile
    return new Set<string>(loop);
}

function parseInput(input: string): [grid: Grid, start: Position] {
    const grid: Grid = [];
    const lines = input.split(/\r?\n/);
    let start: Position = { row: NaN, col: NaN };
    for (let row = 0; row < lines.length; row++) {
        grid.push(lines[row].trim().split('') as Row);
        const startCol = lines[row].indexOf('S');
        if (startCol >= 0) {
            start = { row, col: startCol };
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
    const north: Position = { row: pos.row - 1, col: pos.col };
    if (canPositionsConnect(north, 'N')) {
        yield north;
    }
    const east: Position = { row: pos.row, col: pos.col + 1 };
    if (canPositionsConnect(east, 'E')) {
        yield east;
    }
    const south: Position = { row: pos.row + 1, col: pos.col };
    if (canPositionsConnect(south, 'S')) {
        yield south;
    }
    const west: Position = { row: pos.row, col: pos.col - 1 };
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
    return pos.row >= 0 && pos.row < grid.length &&
        pos.col >= 0 && pos.col < grid[0].length;
}

function getTile(pos: Position, grid: Grid) {
    return grid[pos.row][pos.col];
}

function arePositionsEqual(a: Position, b: Position) {
    return a.row === b.row && a.col === b.col;
}

function posToString(pos: Position) {
    return `${pos.row},${pos.col}`;
}

function stringToPos(str: string): Position {
    const [row, col] = str.split(',').map(Number);
    return { row, col }
}

function getDirection(a: Position, b: Position): Direction | undefined {
    const step = {
        row: b.row - a.row,
        col: b.col - a.col
    } as Position;
    if (arePositionsEqual(step, { row: -1, col: 0 })) {
        return 'N';
    }
    if (arePositionsEqual(step, { row: 0, col: 1 })) {
        return 'E';
    }
    if (arePositionsEqual(step, { row: 1, col: 0 })) {
        return 'S';
    }
    if (arePositionsEqual(step, { row: 0, col: -1 })) {
        return 'W';
    }
}

function getConnectsToByDirection(dir: Direction) {
    switch (dir) {
        case 'N':
            return connectsTo.north;
        case 'E':
            return connectsTo.east;
        case 'S':
            return connectsTo.south;
        case 'W':
            return connectsTo.west;
        default:
            console.log('waht now?');
    }
}