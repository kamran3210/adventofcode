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
    result += findMirrorPositionAfterSmudge(grid) ?? 0;
    // find horizontal reflection
    const gridTransposed = transpose(grid)
    result += 100 * (findMirrorPositionAfterSmudge(gridTransposed) ?? 0);
    return result;
}

function findMirrorPositionAfterSmudge(grid: string[]) {
    for (let x = 1; x < grid[0].length; x++)
        if (gridHasOneDifference(grid, x)) return x
}

function getLineDifferences(line: string, mirrorPos: number): number {
    const left = reverse(line.slice(0, mirrorPos));
    const right = line.slice(mirrorPos);
    const minLength = Math.min(left.length, right.length);
    let differences = 0;
    for (let i = 0; i < minLength; i++) {
        if (left[i] !== right[i]) differences++;
    }
    return differences;
}

function gridHasOneDifference(grid: string[], mirrorPos: number): boolean {
    let differences = 0;
    for (const line of grid) {
        differences += getLineDifferences(line, mirrorPos);
        if (differences > 1) return false;
    }
    return differences === 1;
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