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

function parseInput(input) {
    const lines = input.split('\n');
    const seeds = lines[0].split(': ')[1].split(' ').map(string => {
        return {
            number: Number(string),
            mapped: false
        }
    });
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
        seeds: seeds,
        maps: maps
    }
}

part1().then(result => console.log(result));