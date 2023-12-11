import * as fs from 'fs';

const input: string = fs.readFileSync('./day2/input.txt', 'utf-8');
const lines = input.split(/\r?\n/);

let sum = 0;

for (const line of lines) {
    if (!!line) {
        sum += getMinimumSetPower(line);
    }
}

console.log(sum);

function getMinimumSetPower(line: string): number {
    // line format:
    // Game AA: X COLOUR, Y COLOUR; Z COLOUR W COLOUR
    const split1 = line.split(':');
    const split1Right = split1[1];

    const maxColours = new Map<string, number>();
    maxColours.set("red", 0);
    maxColours.set("green", 0);
    maxColours.set("blue", 0);

    const turns = split1Right.split(';');
    for (const turn of turns) {
        const colourDetails = turn.split(',');
        for (const colourDetail of colourDetails) {
            const split4 = colourDetail.trim().split(' ');
            const amount = +split4[0];
            const colour = split4[1];
            const newMax = Math.max(amount, maxColours.get(colour) ?? 0);
            maxColours.set(colour, newMax);
        }
    }

    const red = maxColours.get("red") as number;
    const green = maxColours.get("green") as number;
    const blue = maxColours.get("blue") as number;
    return red * green * blue;
}