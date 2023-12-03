import * as fs from 'fs';

const input: string = fs.readFileSync('./day1/input.txt', 'utf-8');
const lines = input.split(/\r?\n/);

const stringMap = new Map<string, number>();
stringMap.set("1", 1);
stringMap.set("2", 2);
stringMap.set("3", 3);
stringMap.set("4", 4);
stringMap.set("5", 5);
stringMap.set("6", 6);
stringMap.set("7", 7);
stringMap.set("8", 8);
stringMap.set("9", 9);
stringMap.set("one", 1);
stringMap.set("two", 2);
stringMap.set("three", 3);
stringMap.set("four", 4);
stringMap.set("five", 5);
stringMap.set("six", 6);
stringMap.set("seven", 7);
stringMap.set("eight", 8);
stringMap.set("nine", 9);

const forwardsTokens = new Set<string>();
const backwardsTokens = new Set<string>();
for (const s of stringMap.keys()) {
    for (let i = 0; i < s.length; i++) {
        forwardsTokens.add(s.slice(0, i));
        backwardsTokens.add(s.slice(s.length - i, s.length));
    }
}

let sum = 0;
for (const line of lines) {
    if (!!line) {
        sum += getCalibration(line);
    }
}
console.log(sum)


function getCalibration(line: string) {
    let p1 = 0;
    let p2 = 1;
    let substr1 = line.slice(p1, p2);
    while (!stringMap.has(substr1)) {
        while (!forwardsTokens.has(substr1) && !stringMap.has(substr1)) {
            p1++;
            substr1 = line.slice(p1, p2);
        }
        while (forwardsTokens.has(substr1)) {
            p2++;
            substr1 = line.slice(p1, p2);
        }
    }

    let q1 = line.length - 1;
    let q2 = line.length;
    let substr2 = line.slice(q1, q2);
    while (!stringMap.has(substr2)) {
        while (!backwardsTokens.has(substr2) && !stringMap.has(substr2)) {
            q2--;
            substr2 = line.slice(q1, q2);
        }
        while (backwardsTokens.has(substr2)) {
            q1--;
            substr2 = line.slice(q1, q2);
        }
    }

    const number1 = stringMap.get(substr1) as number;
    const number2 = stringMap.get(substr2) as number;
    return 10 * number1 + number2;
}