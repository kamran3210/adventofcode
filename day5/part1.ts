import * as fs from 'fs';

const input: string = fs.readFileSync('./day5/input.txt', 'utf-8').trim();;

type DataMap = {
    destinationRangeStart: number,
    sourceRangeStart: number,
    rangeLength: number
}

let seeds: number[] = [];
let seedToSoil: DataMap[] = [];
let soilToFertilizer: DataMap[] = [];
let fertilizerToWater: DataMap[] = [];
let waterToLight: DataMap[] = [];
let lightToTemperature: DataMap[] = [];
let temperatureToHumidity: DataMap[] = [];
let humidityToLocation: DataMap[] = [];

parseData(input);
let minLocation = Math.min(...seeds.map(calculateSeedToLocation));
console.log(minLocation);

function calculateSeedToLocation(seed: number): number {
    const seedToLocationPipeline = [
        seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight,
        lightToTemperature, temperatureToHumidity, humidityToLocation
    ];
    let result = seed;
    for (const aToB of seedToLocationPipeline) {
        result = calculateMapping(result, aToB);
    }
    return result;
}

function calculateMapping(source: number, aToB: DataMap[]): number {
    // Get dataMap where max aToB.sourceRangeStart that is less than source
    let i = aToB.length - 1;
    while (aToB[i].sourceRangeStart > source) i--;
    let dataMap = aToB[i]
    let diff = source - dataMap.sourceRangeStart;
    return diff + 1 > dataMap.rangeLength
        ? source
        : dataMap.destinationRangeStart + diff;
}

function parseData(input: string) {
    let [seedsString, theRest] = input.split('seed-to-soil map:');
    const [_, seedsData] = seedsString.split('seeds: ');
    seeds = seedsData.trim().split(' ').map(Number);

    let compareFn = (a: DataMap, b: DataMap) =>
        a.sourceRangeStart - b.sourceRangeStart

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