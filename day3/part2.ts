import * as fs from 'fs';

const input: string = fs.readFileSync('./day3/input.txt', 'utf-8');
const lines = input.split(/\r?\n/).filter(l => l);

let sum = 0;
for (const x of getGearRatios(lines)) {
    sum += x;
}

console.log(sum);

function getGearRatios(schematic: string[]): number[] {
    const gearRatios: number[] = [];
    for (let row = 0; row < schematic.length; row++) {
        for (let col = 0; col < schematic[0].length; col++) {
            const currentTile = schematic[row][col]
            if (currentTile === '*') {
                const adjacentNumbers = getAdjacentNumbers(row, col);
                if (adjacentNumbers.length === 2) {
                    gearRatios.push(adjacentNumbers[0] * adjacentNumbers[1]);
                }
            }
        }
    }

    return gearRatios;

    function getAdjacentNumbers(row: number, col: number): number[] {
        const w = schematic[0].length;
        const h = schematic.length;
        const adjacentNumbers: number[] = [];
        for (let y = Math.max(row - 1, 0); y <= Math.min(row + 1, h - 1); y++) {
            const exploredRow = Array<string>(w);
            for (let x = Math.max(col - 1, 0); x <= Math.min(col + 1, w - 1); x++) {
                exploreRow(schematic[y], x, exploredRow);
            }
            const rowNumbers = exploredRow.join('')
                .split(' ')
                .filter(x => x)
                .map(x => +x);
            adjacentNumbers.push(...rowNumbers)
        }
        return adjacentNumbers;
    }
}

function exploreRow(
    line: string,
    col: number,
    exploredRow: string[]
) {
    if (col < 0 || col >= line.length || exploredRow[col]) {
        return;
    }
    if (!isNumber(line[col])) {
        exploredRow[col] = ' ';
        return;
    }
    else {
        exploredRow[col] = line[col];
    }
    // search backwards
    exploreRow(line, col - 1, exploredRow);
    // search forwards
    exploreRow(line, col + 1, exploredRow);
}

function isNumber(char: string) {
    return !isNaN(char as unknown as number);
}