import * as fs from 'fs';

const input: string = fs.readFileSync('./day7/input.txt', 'utf-8').trim();

type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
type Hand = [Card, Card, Card, Card, Card];
type HandBid = { hand: Hand, bid: number, score?: number };
type HandTypeKey = '00005' | '00013' | '00021' | '00102' | '00110' | '01001' | '10000';

const cardValues: Record<Card, number> = {
    'A': 12, 'K': 11, 'Q': 10, 'J': 9,
    'T': 8, '9': 7, '8': 6,
    '7': 5, '6': 4, '5': 3,
    '4': 2, '3': 1, '2': 0
}

const handTypeRanks: Record<HandTypeKey, number> = {
    '00005': 0, // 1 1 1 1 1 - High card   // 00005
    '00013': 1, // 2 1 1 1 - One pair      // 00013
    '00021': 2, // 2 2 1 - Two pair        // 00021
    '00102': 3, // 3 1 1 - Three of a kind // 00102
    '00110': 4, // 3 2 - Full house        // 00110
    '01001': 5, // 4 1 - Four of a kind    // 01001
    '10000': 6, // 5 - Five of a kind      // 10000
}

let handBids: HandBid[] = parseInput(input);
handBids.sort((a, b) => a.score! - b.score!);
let totalWinnings = 0;
let rank = 1;
for (const handBid of handBids) {
    totalWinnings += handBid.bid * rank;
    rank++;
}
console.log(totalWinnings);

function parseInput(input: string): HandBid[] {
    return input.split(/\r?\n/).filter(Boolean).map(l => {
        const [handString, bid] = l.split(' ');
        const hand = handString.split('') as Hand;
        return { hand, bid: Number(bid), score: scoreHand(hand) };
    });
}

function scoreHand(hand: Hand) {
    const base = cardValues['A'] + 1;
    const exponent = hand.length;
    return Math.pow(base, exponent) * getHandTypeScore(hand) + getHandStrengthScore(hand);
}

function getHandTypeScore(hand: Hand): number {
    const cardFreqs = getFrequencies(hand);
    const freqFreqs = getFrequencies(cardFreqs.values());
    let typeKey = '';
    for (let i = hand.length; i > 0; i--) {
        if (freqFreqs.has(i)) {
            typeKey += freqFreqs.get(i)!;
        }
        else {
            typeKey += 0;
        }
    }
    return handTypeRanks[typeKey as HandTypeKey];
}

function getHandStrengthScore(hand: Hand): number {
    let strength = 0;
    for (const card of hand) {
        strength *= cardValues['A'] + 1;
        strength += cardValues[card];
    }
    return strength;
}

function getFrequencies<T>(x: Iterable<T>) {
    const frequencies = new Map<T, number>();
    for (const t of x) {
        const newFrequency = frequencies.has(t)
            ? frequencies.get(t)! + 1
            : 1
        frequencies.set(t, newFrequency);
    }
    return frequencies;
}