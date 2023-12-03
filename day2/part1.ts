import * as fs from 'fs';

const input: string = fs.readFileSync('./day2/input.txt', 'utf-8');
const lines = input.split(/\r?\n/);

const maxColours = new Map<string, number>();
maxColours.set("red", 12);
maxColours.set("green", 13);
maxColours.set("blue", 14);

let sum = 0;

for (const line of lines) {
    if (!!line) {
        sum += getGameInfo(line);
    }
}

console.log(sum);

function getGameInfo(line: string): number {
    // line format:
    // Game AA: X COLOUR, Y COLOUR; Z COLOUR W COLOUR
    const split1 = line.split(':');
    const split1Left = split1[0];
    const split1Right = split1[1];

    const id = +split1Left.slice(5, split1Left.length);

    const turns = split1Right.split(';');
    for (const turn of turns) {
        const colourDetails = turn.split(',');
        for (const colourDetail of colourDetails) {
            const split4 = colourDetail.trim().split(' ');
            const amount = +split4[0];
            const colour = split4[1];
            if (maxColours.get(colour) as number < amount) {
                return 0;
            }
        }
    }

    return id;
}