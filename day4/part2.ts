import * as fs from 'fs';

const input: string = fs.readFileSync('./day4/input.txt', 'utf-8');
const lines = input.split(/\r?\n/).filter(Boolean);

type CardDetail = { numbers: number[], winningNumbers: Set<number> };

// Memoized recursive method
const countCardsCache = new Map<number, number>();
const cardDetails = getCardDetails(lines);
let totalCards = 0;
for (let i = 0; i < cardDetails.length; i++) {
    totalCards += countCardsRecursive(i)
}
console.log(totalCards);

// Dynamic method
const dp = Array<number>(lines.length);
dp.fill(1);
totalCards = 0;
for (let i = lines.length - 1; i >= 0; i--) {
    totalCards += countCardsDynamic(i, lines[i])
}
console.log(totalCards);

function countCardsRecursive(
    cardIndex: number
): number {
    if (countCardsCache.has(cardIndex)) {
        return countCardsCache.get(cardIndex) as number;
    }
    let count = 1;
    const card = cardDetails[cardIndex];
    let offset = 0;
    for (const n of card?.numbers) {
        if (card.winningNumbers.has(n)) {
            offset++;
            count += countCardsRecursive(cardIndex + offset);
        }
    }
    countCardsCache.set(cardIndex, count)
    return count;
}

function countCardsDynamic(
    cardIndex: number,
    line: string,
): number {
    let card = getCardDetail(line);
    let offset = 0;
    for (const n of card?.numbers) {
        if (card.winningNumbers.has(n)) {
            offset++;
            dp[cardIndex] += dp[cardIndex + offset];
        }
    }
    return dp[cardIndex];
}

function getCardDetails(
    lines: string[]
): CardDetail[] {
    const cardDetails: CardDetail[] = [];
    lines.forEach((l, idx) => {
        cardDetails.push(getCardDetail(l));
    });
    return cardDetails;
}

function getCardDetail(line: string): CardDetail {
    const [_cardInfo, cardNumbers] = line.split(':');
    const [numbersString, winningNumbersString] = cardNumbers.split('|');
    const numbers: number[] = getNumberList(numbersString);
    const winningNumbers = new Set<number>(getNumberList(winningNumbersString));
    return { numbers, winningNumbers };
}

function getNumberList(numbersString: string): number[] {
    return numbersString
        .trim()
        .split(' ')
        .filter(s => s !== '')
        .map(Number);
}