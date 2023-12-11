import * as fs from 'fs';

const input: string = fs.readFileSync('./day3/input.txt', 'utf-8');
const lines = input.split(/\r?\n/).filter(l => l);

let sum = 0;
for (const x of getPartNumbers(lines)) {
    sum += x;
}

console.log(sum);

function getPartNumbers(schematic: string[]): number[] {
    const partNumbers: number[] = [];
    for (let row = 0; row < schematic.length; row++) {
        let buffer = ''
        let hasAdjacentSymbol = false;
        for (let col = 0; col < schematic[0].length; col++) {
            const currentTile = schematic[row][col]
            if (isNumber(currentTile)) {
                buffer += currentTile;
                if (!hasAdjacentSymbol && checkAdjacentTiles(row, col)) {
                    hasAdjacentSymbol = true;
                }
            }
            else {
                checkBuffer(buffer, hasAdjacentSymbol);
                buffer = '';
                hasAdjacentSymbol = false;
            }
        }
        checkBuffer(buffer, hasAdjacentSymbol);
    }

    return partNumbers;

    function checkAdjacentTiles(row: number, col: number): boolean {
        const w = schematic[0].length;
        const h = schematic.length;
        for (let y = Math.max(row - 1, 0); y <= Math.min(row + 1, h - 1); y++) {
            for (let x = Math.max(col - 1, 0); x <= Math.min(col + 1, w - 1); x++) {
                if (isSymbol(schematic[y][x])) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkBuffer(buffer: string, hasAdjacentSymbol: boolean) {
        if (buffer && hasAdjacentSymbol) {
            partNumbers.push(+buffer)
        }
    }
}

function isSymbol(char: string) {
    return char !== '.' && !isNumber(char);
}

function isNumber(char: string) {
    return !isNaN(char as unknown as number);
}