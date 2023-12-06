import * as fs from 'fs';

type RangeMap = {
    start: number,
    end: number,
    offset: number
};

const input: string = fs.readFileSync('./day5/input.txt', 'utf-8').trim();;

let seeds: RangeMap[] = [];
let seedToSoil: RangeMap[] = [];
let soilToFertilizer: RangeMap[] = [];
let fertilizerToWater: RangeMap[] = [];
let waterToLight: RangeMap[] = [];
let lightToTemperature: RangeMap[] = [];
let temperatureToHumidity: RangeMap[] = [];
let humidityToLocation: RangeMap[] = [];

let seedToLocationPipeline = [
    seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight,
    lightToTemperature, temperatureToHumidity, humidityToLocation
];

parseData(input);
let locations = Array.from(seeds)
for (const rangeMaps of seedToLocationPipeline) {
    locations = composeArrays(locations, rangeMaps);
}
const answer = rangeMapMin(...locations);
console.log(answer);

function parseData(input: string) {
    let [seedRanges, ...mapData] = input.split(/\r?\n\r?\n/);
    let seedRangeNumbers = seedRanges.split(': ')[1].split(' ').map(Number);
    for (let i = 0; i < seedRangeNumbers.length; i += 2) {
        seeds.push({
            start: seedRangeNumbers[i],
            end: seedRangeNumbers[i] + seedRangeNumbers[i + 1] - 1,
            offset: 0
        });
    }
    for (let i = 0; i < mapData.length; i++) {
        mapData[i].split(/\r?\n/).slice(1).forEach(l => {
            const nums = l.split(' ').map(Number)
            seedToLocationPipeline[i].push({
                start: nums[1],
                end: nums[1] + nums[2] - 1,
                offset: nums[0] - nums[1]
            } as RangeMap);
        });
    }
}

function compose(a: RangeMap, b: RangeMap): RangeMap[] {
    const result: RangeMap[] = [];
    const intersection = intersect(a, b);
    if (intersection) {
        result.push(intersection);
        result.push(...subtract(a, b));
    } else {
        result.push(a);
    }
    return result;
}

function composeArray(array: RangeMap[], b: RangeMap): RangeMap[] {
    const result: RangeMap[] = [];
    for (const a of array) {
        result.push(...compose(a, b));
    }
    return result;
}

function composeArrays(a: RangeMap[], b: RangeMap[]): RangeMap[] {
    let transformedResult = a.map(rm => transformRangeMap(rm, rm.offset));
    for (const rm of b) {
        transformedResult = composeArray(transformedResult, rm);
    }
    const result = transformedResult.map(trm => {
        const matchingRange = a.filter(
            rm => trm.start >= rm.start + rm.offset && trm.end <= rm.end + rm.offset)[0];
        return transformRangeMap(trm, -matchingRange.offset);
    });
    return result;
}

function intersect(a: RangeMap, b: RangeMap) {
    const start = Math.max(a.start, b.start);
    const end = Math.min(a.end, b.end);
    if (end < start) {
        return;
    }
    return {
        start,
        end,
        offset: a.offset + b.offset
    } as RangeMap
}

function subtract(a: RangeMap, b: RangeMap): RangeMap[] {
    const result: RangeMap[] = [];
    if (a.start < b.start) { // aaaaa####bbbbbb - b starts to the right
        result.push({
            start: a.start,
            end: Math.min(a.end, b.start - 1),
            offset: a.offset
        } as RangeMap);
    }
    if (b.end < a.end) { // bbb####aaaaa - b overlaps on left
        result.push({
            start: Math.max(b.end + 1, a.start),
            end: a.end,
            offset: a.offset
        } as RangeMap);
    }
    return result;
}

function transformRangeMap(rm: RangeMap, offset: number): RangeMap {
    return {
        start: rm.start + offset,
        end: rm.end + offset,
        offset: rm.offset - offset,
    } as RangeMap;
}

function rangeMapMin(...rangeMaps: RangeMap[]): number {
    let min = Infinity;
    for (const rm of rangeMaps) {
        min = Math.min(min, rm.start + rm.offset);
    }
    return min;
}