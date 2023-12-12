import * as fs from 'fs';

const input: string = fs.readFileSync('./day12/input.txt', 'utf-8').trim();

let sum = 0;
for (const line of input.split(/\r?\n/)) {
    sum += getCombosDynamic(...unfold(...stringToPatternAndParts(line)));
}
console.log(sum);

function getCombosDynamic(pattern: string, parts: number[]): number {
    const dp = Array<number[]>(pattern.length + 1).fill([])
        .map(() => Array<number>(parts.length + 1).fill(0));

    for (let j = parts.length; j >= 0; j--) {
        for (let i = pattern.length; i >= 0; i--) {
            dp[i][j] = f(i, j);
        }
    }
    return dp[0][0];

    function f(i: number, j: number): number {
        const fWhenHash = () =>
            partFits(i, j) ? dpGet(i + parts[j] + 1, j + 1) : 0;
        switch (pattern[i]) {
            case '.':
                return dpGet(i + 1, j);
            case '#':
                return fWhenHash();
            case '?':
                return dpGet(i + 1, j) + fWhenHash();
            default:
                return dpGet(i, j);
        }
    }

    function partFits(i: number, j: number): boolean {
        const part = parts[j]
        if (!part ||                     // j out of bounds
            pattern[i + part] === '#' || // Too crowded e.g. #??# 3
            pattern.length - i < part    // Pattern too short e.g. ## 3
        ) {
            return false;
        }
        // Not enough space e.g. ?#. 3
        const dotIndex = pattern.slice(i, i + part).indexOf(".");
        return dotIndex === -1;
    }

    function dpGet(i: number, j: number) {
        // Predefined 1s (both in and out of bounds)
        if (i >= pattern.length && j === parts.length) return 1;
        // Predefined 0s (out of bounds)
        if (i > pattern.length || j > parts.length) return 0;
        // In bounds
        return dp[i][j];
    }
}

function stringToPatternAndParts(
    line: string
): [pattern: string, parts: number[]] {
    const [pattern, parts] = line.trim().split(' ');
    return [pattern, parts.split(',').map(p => Number(p.trim()))];
}

function unfold(
    pattern: string,
    parts: number[]
): [pattern: string, parts: number[]] {
    const unfoldedPattern = Array<string>(5).fill(pattern).join('?');
    const unfoldedParts = [...parts, ...parts, ...parts, ...parts, ...parts];
    return [unfoldedPattern, unfoldedParts];
}