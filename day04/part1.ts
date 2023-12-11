import * as fs from 'fs';

const input: string = fs.readFileSync('./day4/input.txt', 'utf-8');
const lines = input.split(/\r?\n/).filter(Boolean);

let sum = 0;
for (const line of lines) {
    sum += getScoreFromLine(line);
}

console.log(sum);

function getScoreFromLine(line: string): number {
    const [_cardInfo, cardNumbers] = line.split(':');
    const [numbersString, winningNumbersString] = cardNumbers.split('|');
    const numbers: number[] = getNumberList(numbersString);
    const winningNumbers = new Set<number>(getNumberList(winningNumbersString));
    return getScore(numbers, winningNumbers);
}

function getNumberList(numbersString: string): number[] {
    return numbersString
        .trim()
        .split(' ')
        .filter(s => s !== '')
        .map(Number);
}

function getScore(
    numbers: number[],
    winningNumbers: Set<number>
): number {
    let score = 0;
    for (const n of numbers) {
        if (winningNumbers.has(n)) {
            score = score === 0
                ? 1
                : score * 2;
        }
    }
    return score;
}