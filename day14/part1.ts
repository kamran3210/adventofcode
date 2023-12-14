import * as fs from 'fs';

const input: string = fs.readFileSync('./day14/input.txt', 'utf-8').trim();

const grid = input.split(/\r?\n/);

let load = 0;
for (let col = 0; col < grid[0].length; col++) {
    let weight = grid.length;
    for (let row = 0; row < grid.length; row++) {
        if (grid[row][col] === '#') weight = grid.length - row - 1;
        if (grid[row][col] === 'O') load += weight--;
    }
}
console.log(load);