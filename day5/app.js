import { getInput } from '../utils/utils.js'

async function part1() {
    const oneMapping = true;
    const parsedInput = parseInput(await getInput(5));
    let currentValues = parsedInput.seeds;
    const maps = parsedInput.maps;
    for (const map of maps) {
        let newValues = [];
        for (const mapper of map) {
            for (let i = 0; i < currentValues.length; i++){
                if (currentValues[i].number >= mapper.start && currentValues[i].number <= mapper.end) {
                    if (oneMapping && currentValues[i].mapped) {
                        continue;
                        // This was just to test to see if they did anything tricky in the input like having seeds map
                        //  to multiple values down the line, which turned out to be not true, this condition never hit
                    }
                    newValues.push({
                        number: currentValues[i].number + mapper.adjust,
                        mapped: false
                    })
                    currentValues[i].mapped = true;
                }
            }
        }
        currentValues.filter(value => !value.mapped).forEach(value => newValues.push(value));
        currentValues = newValues;
    }
    return currentValues.map(value => value.number)
        .sort( (a, b) => {
            if(a > b) return 1;
            if(a < b) return -1;
            return 0;
        })[0];
}

async function part2() {
    const parsedInput = parseInput(await getInput(5));
    let seeds = parsedInput.seeds;
    const maps = parsedInput.maps;
    for (const map of maps) {
        const newSeeds = [];
        for (const mapper of map) {
            for (let seedIndex = 0; seedIndex < seeds.length; seedIndex++) {
                const seed = seeds[seedIndex];
                if (isOverlap(seed, mapper)) {
                    const overlap = getOverlap(seed, mapper);
                    overlap.overlap.start += mapper.adjust;
                    overlap.overlap.end += mapper.adjust;
                    newSeeds.push(overlap.overlap);
                    seeds.splice(seedIndex, 1);
                    seedIndex--;
                    for (const s of overlap.seeds) {
                        seeds.push(s);
                    }
                }
            }
        }
        seeds.forEach(seed => newSeeds.push(seed));
        seeds = reduceSeeds(newSeeds);
    }
    seeds = seeds.sort(compareRanges);
    return seeds[0].start;
}

function reduceSeeds(seeds) {
    const newSeeds = [];
    const sorted = seeds.sort(compareRanges);
    for (let i = 0; i < sorted.length; i++) {
        let combined = false;
        let j = i + 1;
        if (j < sorted.length && isOverlap(sorted[i], sorted[j])) {
            sorted[j].start = Math.min(sorted[i].start, sorted[j].start);
            sorted[j].end = Math.max(sorted[i].end, sorted[j].end);
            combined = true;
        }
        if (!combined) {
            newSeeds.push(seeds[i]);
        }
    }
    return newSeeds;
}

function isOverlap(a, b) {
    return (a.start >= b.start && a.start <= b.end) || (a.end >= b.start && a.end <= b.end) || (b.start >= a.start && b.end <= a.end);
}

function getOverlap(seeds, mapper) {
    const comparison = compareRanges(seeds, mapper);
    if (comparison === 1) {
        if (seeds.end <= mapper.end) {
            return {
                seeds: [],
                overlap: {
                    start: seeds.start,
                    end: seeds.end
                }
            }
        } else {
            return {
                seeds: [
                    {
                        start: mapper.end + 1,
                        end: seeds.end
                    }
                ],
                overlap: {
                    start: seeds.start,
                    end: mapper.end
                }
            }
        }
    } else if (comparison === -1) {
        if (seeds.end >= mapper.end) {
            return {
                seeds: [
                    {
                        start: seeds.start,
                        end: mapper.start - 1
                    },
                    {
                        start: mapper.end + 1,
                        end: seeds.end
                    }
                ],
                overlap: {
                    start: mapper.start,
                    end: mapper.end
                }
            }
        } else {
            return {
                seeds: [
                    {
                        start: seeds.start,
                        end: mapper.start - 1
                    }
                ],
                overlap: {
                    start: mapper.start,
                    end: seeds.end
                }
            }
        }
    } else {
        console.log("***********COLLISION!!!!");
    }
}

function parseInput(input) {
    const lines = input.split('\n');
    const seeds = [];
    const seedSplit = lines[0].split(': ')[1].split(' ');
    for (let i = 0; i < seedSplit.length - 1; i += 2) {
        const start = Number(seedSplit[i]);
        const range = Number(seedSplit[i + 1]);
        seeds.push({
            start: start,
            end: start + range - 1
        });
    }
    const maps = [];
    let mapsIndex = -1;
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(':')) {
            maps.push([]);
            mapsIndex++;
        } else if (line) {
            const values = line.split(' ');
            const to = Number(values[0]);
            const from = Number(values[1]);
            const range = Number(values[2]);
            maps[mapsIndex].push({
               start: from,
               end: from + range - 1,
               adjust:  to - from
            });
        }
    }
    return {
        seeds: seeds.sort(compareRanges),
        maps: maps
    }
}

function compareRanges(a, b) {
    if (a.start >= b.start) {
        return 1;
    } else if (a.start === b.start) {
        if (a.end >= b.end) {
            return 1;
        } else if (a.end === b.end) {
            return 0;
        } else {
            return -1;
        }
    } else {
        return -1;
    }
}

part2().then(result => console.log(result));