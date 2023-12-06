import * as fs from 'fs';

const input: string = fs.readFileSync('./day6/input.txt', 'utf-8').trim();

const [times, distances] = parseInput(input);
let result = 1;
for (let i = 0; i < times.length; i++) {
    const solutions = solveQuadratic(-1, times[i], -distances[i]);
    if (solutions.length <= 1) {
        result = 0;
        console.log(i, solutions.length, 'solutions');
        break;
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
        result = 0;
        console.log(i, 'b < a', solutions);
        break;
    }
    result *= b - a + 1

}
console.log(result);


function parseInput(input: string): readonly [times: number[], distances: number[]] {
    return input.split(/\r?\n/).map(
        l => l
            .split(':')[1]
            .trim()
            .split(' ')
            .filter(n => n !== '')
            .map(Number)
    ) as [times: number[], distances: number[]];
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