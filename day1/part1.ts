import * as fs from 'fs';

const input: string = fs.readFileSync('./day1/input.txt', 'utf-8');
const lines = input.split(/\r?\n/);

const numbers = new Set<string>(["1", "2", "3", "4", "5", "6", "7", "8", "9"]) 
let sum = 0;

for (const line of lines) {
    if (!!line) {
        sum += getCalibration(line);
    }
}

console.log(sum)


function getCalibration(line: string) {
    console.log(line);
    let p1 = 0;
    while (!numbers.has(line[p1])) {
        p1++;
    }
    let p2 = line.length - 1;
    while (!numbers.has(line[p2])) {
        p2--;
    }
    const number = line[p1] + line[p2];
    return +number;
}