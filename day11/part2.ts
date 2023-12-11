import * as fs from 'fs';

const input: string = fs.readFileSync('./day11/input.txt', 'utf-8').trim();

type Position = { row: number, col: number }

const grid = input.split(/\r?\n/);
const galaxyRows = new Set<number>();
const galaxyCols = new Set<number>();
const galaxyPositions: Position[] = []
const expansionRate = 1000000;

for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
        if (grid[row][col] === '#') {
            galaxyRows.add(row);
            galaxyCols.add(col);
            galaxyPositions.push({ row, col });
        }
    }
}

let result = 0;
for (let i = 1; i < galaxyPositions.length; i++) {
    for (let j = 0; j < i; j++) {
        result += calculateDistanceAfterExpansion(galaxyPositions[i], galaxyPositions[j]);
    }
}
console.log(result);

function calculateDistanceAfterExpansion(a: Position, b: Position) {
    let distance = 0;
    const startRow = Math.min(a.row, b.row) + 1;
    const endRow = Math.max(a.row, b.row);
    for (let row = startRow; row <= endRow; row++) {
        distance += galaxyRows.has(row) ? 1 : expansionRate;
    }
    const startCol = Math.min(a.col, b.col) + 1;
    const endCol = Math.max(a.col, b.col);
    for (let col = startCol; col <= endCol; col++) {
        distance += galaxyCols.has(col) ? 1 : expansionRate;
    }
    return distance;
}