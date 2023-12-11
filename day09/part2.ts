import * as fs from 'fs';

const input: string = fs.readFileSync('./day9/input.txt', 'utf-8').trim();

let sum = 0;
for (const line of input.split(/\r?\n/)) {
    const sequence = line.trim().split(' ').map(Number).reverse();
    sum += (interpolateNext(sequence))
}
console.log(sum);

function interpolateNext(sequence: number[]): number {
    if (sequence.length === 1) {
        return sequence[0] === 0
            ? 0
            : NaN;
    }
    const differences: number[] = [];
    let allZeros = true;
    for (let i = 1; i < sequence.length; i++) {
        const difference = sequence[i] - sequence[i - 1];
        if (difference !== 0) {
            allZeros = false;
        }
        differences.push(difference);
    }
    if (allZeros) {
        return sequence[0];
    }
    const next = sequence[sequence.length - 1] + interpolateNext(differences);
    return next;
}