import * as fs from 'fs';

const input: string = fs.readFileSync('./day7/input.txt', 'utf-8').trim();

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type HandBid = {hand: string, bid: number};

let hands: HandBid[] = parseInput(input);
console.log(hands);

function parseInput(input: string): HandBid[] {
    return input.split(/\r?\n/).filter(Boolean).map(l => {
        const [hand, bid] = l.split(' ');
        return {hand, bid: Number(bid)};
    });
}

function scoreHand(hand: string) {
    return rankHandType(hand) * rankHandStrength(hand);
}

function rankHandType(hand: string): number {
    const frequencies: Record<Card, number> = {
        A: 0, K: 0, Q: 0, J: 0, T: 0,
        9: 0, 8: 0, 7: 0, 6: 0, 5: 0,
        4: 0, 3: 0, 2: 0
    };
    // 5
    // 4 1
    // 3 2
    // 3 1 1
    // 2 2 1
    // 2 1 1 1
    // 1 1 1 1 1
    return 1;
}

function rankHandStrength(hand: string): number {
    return 1;
}