import * as fs from 'fs';

const input: string = fs.readFileSync('./day6/input.txt', 'utf-8').trim();

const [time, distance] = parseInput(input);
const solutions = solveQuadratic(-1, time, -distance);
let result = 0;
if (solutions.length <= 1) {
    console.log(solutions.length, 'solutions');
}
const [lowerSolution, upperSolution] = solutions;
// Lowest integer >= lowerSolution
const lowerInt = Math.ceil(lowerSolution);
const a = lowerInt - lowerSolution < 1e-16
    ? lowerInt + 1
    : lowerInt;
// Highest integer <= upperSolution
const upperInt = Math.floor(upperSolution);
const b = upperSolution - upperInt < 1e-16
    ? upperInt - 1
    : upperInt;
if (b < a) {
    console.log('b < a', solutions);
}
result = b - a + 1;
console.log(result);


function parseInput(input: string): readonly [time: number, distance: number] {
    return input.split(/\r?\n/).map(
        l => Number(l.replace(/[^\d]/g, ''))
    ) as [times: number, distances: number];
}

function solveQuadratic(
    a: number,
    b: number,
    c: number
): number[] {
    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return [];
    }
    if (discriminant === 0) {
        return [-b / (2 * a)]
    }
    const solutions: number[] = [];
    const x = Math.sqrt(discriminant);
    if (a < 0) {
        solutions.push((-b + x) / (2 * a));
        solutions.push((-b - x) / (2 * a));
    }
    else {
        solutions.push((-b - x) / (2 * a));
        solutions.push((-b + x) / (2 * a));
    }
    return solutions;
}