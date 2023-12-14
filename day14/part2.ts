import * as fs from 'fs';

const input: string = fs.readFileSync('./day14/input.txt', 'utf-8').trim();

type Tile = '#' | 'O' | '.';

const grid: Tile[][] = input.split(/\r?\n/).map(l => l.trim().split('') as Tile[]);

var start = performance.now();
const states = new Map<string, number>();
const loads: number[] = [];
let cycleNo = 0;
while (!states.has(gridToString())) {
    states.set(gridToString(), cycleNo++);
    loads.push(getLoad());
    cycle();
}
const repeatsStartAt = states.get(gridToString())!;
const repeatsEvery = cycleNo - repeatsStartAt;
const targetCycleNo = 1e9;
const targetEquivalantTo = (targetCycleNo - repeatsStartAt) % repeatsEvery + repeatsStartAt;
console.log(loads[targetEquivalantTo]);
console.log(performance.now() - start);

function cycle() {
    slideNorth();
    slideWest();
    slideSouth();
    slideEast();
}

function slideNorth() {
    for (let col = 0; col < grid[0].length; col++) {
        const line = grid.map(row => row[col]);
        const lineAfterSlide = afterSlide(line);
        grid.forEach((row, i) => row[col] = lineAfterSlide[i]);
    }
}

function slideSouth() {
    for (let col = 0; col < grid[0].length; col++) {
        const line = grid.map(row => row[col]).reverse();
        const lineAfterSlide = afterSlide(line).reverse();
        grid.forEach((row, i) => row[col] = lineAfterSlide[i]);
    }
}

function slideEast() {
    for (let row = 0; row < grid[0].length; row++) {
        const line = grid[row].reverse();
        grid[row] = afterSlide(line).reverse();
    }
}

function slideWest() {
    for (let row = 0; row < grid[0].length; row++) {
        const line = grid[row];
        grid[row] = afterSlide(line);
    }
}

function afterSlide(line: Tile[]): Tile[] {
    let slideTo = 0;
    let newCol = Array<Tile>(line.length).fill('.');
    for (let idx = 0; idx < line.length; idx++) {
        if (line[idx] === '#') {
            newCol[idx] = '#';
            slideTo = idx + 1;
        }
        if (line[idx] === 'O') {
            newCol[slideTo] = 'O';
            slideTo++;
        }
    }
    return newCol;
}

function getLoad() {
    return grid.reduce((a, row, i) => (a + count(row, 'O') * (grid.length - i)), 0);
}

function gridToString() {
    return grid.map(row => row.join('')).join('\n')
}

function count<T>(arr: Array<T>, val: T) {
    return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
}