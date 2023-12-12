import * as fs from 'fs';

const input: string = fs.readFileSync('./day12/input.txt', 'utf-8').trim();

let gCache = new Map<string, number>();

let sum = 0;
for (const line of input.split(/\r?\n/)) {
    sum += getCombosRecursive(...stringToPatternAndParts(line), 0);
}
console.log(sum);

function getCombosRecursive(pattern: string, parts: number[], depth: number): number {
    const cacheKey = patternAndPartsToString(pattern, parts);
    if (gCache.has(cacheKey)) {
        // console.log(depth, cacheKey, 'hit cache');
        return gCache.get(cacheKey)!;
    }

    // loop through the pattern until i find a # or a ?
    for (let i = 0; i < pattern.length; i++) {
        // found a #
        if (pattern[i] === '#') {
            // if we shouldn't have any more parts
            if (!parts.length) {
                gCache.set(cacheKey, 0);
                return 0;
            }
            const space = pattern.slice(i).split('.')[0].length;
            // parts[0] cannot fit here because not enough room
            if (space < parts[0]) {
                gCache.set(cacheKey, 0);
                return 0;
            }
            // parts[0] cannot fit here because its too crowded e.g. #??# 3
            if (pattern.slice(i)[parts[0]] === '#') {
                gCache.set(cacheKey, 0);
                return 0;
            }
            // parts[0] can fit here
            const result = getCombosRecursive(pattern.slice(i + parts[0] + 1), parts.slice(1), depth + 1);
            gCache.set(cacheKey, result);
            return result;
        };

        // found a ?
        if (pattern[i] === '?') {
            // set it to # or ? and calculate combinations for both
            const result = getCombosRecursive(pattern.replace('?', '#'), parts, depth + 1) + getCombosRecursive(pattern.replace('?', '.'), parts, depth + 1);
            gCache.set(cacheKey, result);
            return result;
        }
    }

    // There are unplaced parts
    if (parts.length) {
        gCache.set(cacheKey, 0);
        return 0;
    }
    // choose 0 from empty set = 0
    gCache.set(cacheKey, 1);
    return 1;
}

function patternAndPartsToString(pattern: string, parts: number[]) {
    return `${pattern} ${parts.join(',')}`
}

function stringToPatternAndParts(
    line: string
): [pattern: string, parts: number[]] {
    const [pattern, parts] = line.trim().split(' ');
    // console.log(parts)
    return [pattern, parts.split(',').map(p => Number(p.trim()))];
}