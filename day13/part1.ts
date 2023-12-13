import * as fs from 'fs';

const input: string = fs.readFileSync('./day13/input.txt', 'utf-8').trim();

const patterns = input.split(/\r?\n\r?\n/);

let sum = 0;
for (const p of patterns) {
    sum += f(p);
}
console.log(sum);

function f(p: string): number {
    let result = 0;
    // find vertical reflection
    const grid: string[] = p.split(/\r?\n/);
    result += findMirrorPosition(grid) ?? 0;
    // find horizontal reflection
    const gridTransposed = transpose(grid)
    result += 100 * (findMirrorPosition(gridTransposed) ?? 0);
    return result;
}

function findMirrorPosition(grid: string[]) {
    let possibleMirrorPositions: number[] = Array.from({ length: grid[0].length - 1 }, (_, i) => i + 1);
    for (const line of grid) {
        // find vertical reflection
        possibleMirrorPositions = possibleMirrorPositions.filter(x => getPossibleMirrorPositions(line).has(x));
    }
    return possibleMirrorPositions.at(-1);
}

function getPossibleMirrorPositions(line: string) {
    const possibleMirrorPositions = new Set<number>();
    for (let i = 1; i < line.length; i++) {
        const left = line.slice(0, i);
        const right = line.slice(i);
        if (left.endsWith(reverse(right)) || right.startsWith(reverse(left))) {
            possibleMirrorPositions.add(i);
        }
    }
    return possibleMirrorPositions
}

function transpose(grid: string[]): string[] {
    const gridTransposed: string[] = [];
    for (let col = 0; col < grid[0].length; col++) {
        const line = grid.map(l => l[col]).join('');
        gridTransposed.push(line);
    }
    return gridTransposed;
}

function reverse(s: string) {
    return s.split("").reverse().join("");
}