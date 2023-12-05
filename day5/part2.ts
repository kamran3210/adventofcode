import * as fs from 'fs';

const input: string = fs.readFileSync('./day5/input.txt', 'utf-8').trim();;

type DataMap = {
    destinationRangeStart: number,
    sourceRangeStart: number,
    rangeLength: number
}
type SeedRange = { rangeStart: number, rangeLength: number; }

let seeds: SeedRange[] = [];
let seedToSoil: DataMap[] = [];
let soilToFertilizer: DataMap[] = [];
let fertilizerToWater: DataMap[] = [];
let waterToLight: DataMap[] = [];
let lightToTemperature: DataMap[] = [];
let temperatureToHumidity: DataMap[] = [];
let humidityToLocation: DataMap[] = [];

parseData(input);
let location = 0;
// Loop takes ~9.5s on my 5800X for my set of inputs
while (!isSeedInSeeds(calculateLocationToSeed(location))) location++;
console.log(location);

function isSeedInSeeds(seed: number) {
    let i = seeds.length - 1;
    while (seeds[i].rangeStart > seed) i--;
    let seedRange = seeds[i];
    let diff = seed - seedRange.rangeStart;
    return diff + 1 <= seedRange.rangeLength;
}

function calculateLocationToSeed(location: number): number {
    const locationToSeedPipeline = [
        seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight,
        lightToTemperature, temperatureToHumidity, humidityToLocation
    ].reverse();
    let result = location;
    for (const aToB of locationToSeedPipeline) {
        result = calculateReverseMapping(result, aToB);
    }
    return result;
}

function calculateReverseMapping(destination: number, aToB: DataMap[]): number {
    // Get dataMap where max aToB.destinationRangeStart that is less than destination
    let i = aToB.length - 1;
    while (aToB[i].destinationRangeStart > destination) i--;
    let dataMap = aToB[i]
    let diff = destination - dataMap.destinationRangeStart;
    return diff + 1 > dataMap.rangeLength
        ? destination
        : dataMap.sourceRangeStart + diff;
}

function parseData(input: string) {
    let [seedsString, theRest] = input.split('seed-to-soil map:');
    const [_, seedsData] = seedsString.split('seeds: ');
    let seedsDataNumbers = seedsData.trim().split(' ').map(Number);
    for (let i = 0; i < seedsDataNumbers.length; i += 2) {
        seeds.push({
            rangeStart: seedsDataNumbers[i],
            rangeLength: seedsDataNumbers[i + 1],
        });
    }
    seeds.sort((a, b) => a.rangeStart - b.rangeStart);

    let compareFn = (a: DataMap, b: DataMap) =>
        a.destinationRangeStart - b.destinationRangeStart

    let seedToSoilData: string;
    [seedToSoilData, theRest] = theRest.trim().split('soil-to-fertilizer map:');
    seedToSoil = parseMapData(seedToSoilData, compareFn);

    let soilToFertilizerData: string;
    [soilToFertilizerData, theRest] = theRest.trim().split('fertilizer-to-water map:');
    soilToFertilizer = parseMapData(soilToFertilizerData, compareFn);

    let fertilizerToWaterData: string;
    [fertilizerToWaterData, theRest] = theRest.trim().split('water-to-light map:');
    fertilizerToWater = parseMapData(fertilizerToWaterData, compareFn);

    let waterToLightData: string;
    [waterToLightData, theRest] = theRest.trim().split('light-to-temperature map:');
    waterToLight = parseMapData(waterToLightData, compareFn);

    let lightToTemperatureData: string;
    [lightToTemperatureData, theRest] = theRest.trim().split('temperature-to-humidity map:');
    lightToTemperature = parseMapData(lightToTemperatureData, compareFn);

    let temperatureToHumidityData: string;
    [temperatureToHumidityData, theRest] = theRest.trim().split('humidity-to-location map:');
    temperatureToHumidity = parseMapData(temperatureToHumidityData, compareFn);

    let humidityToLocationData = theRest.trim();
    humidityToLocation = parseMapData(humidityToLocationData, compareFn);

    function parseMapData(mapData: string, compareFn: ((a: DataMap, b: DataMap) => number)): DataMap[] {
        const dataMap: DataMap[] = [];
        mapData.split(/\r?\n/).filter(Boolean).forEach(l => {
            const [destinationRangeStart, sourceRangeStart, rangeLength] =
                l.trim().split(' ').map(Number);
            dataMap.push({ destinationRangeStart, sourceRangeStart, rangeLength });
        });
        dataMap.sort(compareFn);
        return dataMap;
    }
}