import { getInput } from '../utils/utils.js'

async function part1() {
    const races = parseInput(await getInput(6));
    const maxTime = getMaxTime(races);
    const distances = calculateDistances(maxTime);
    let total = 1;
    for (const race of races) {
        total *= distances[race.time].filter(distance => distance > race.distance).length;
    }
    return total;
}

function getMaxTime(races) {
    return races.map(race => race.time).sort(compareNumbers)[races.length - 1];
}

function calculateDistances(maxTime) {
    const distances = [];
    for (let raceTime = 0; raceTime <= maxTime; raceTime++) {
        distances.push([]);
        for (let holdTime = 0; holdTime <= raceTime; holdTime++) {
            distances[raceTime].push(holdTime * (raceTime - holdTime));
        }
    }
    return distances;
}

function compareNumbers(a, b) {
    if (a >= b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        return -1;
    }
}

function parseInput(input) {
    const regex = /\s+/;
    const races = [];
    const lines = input.split('\n');
    const times = lines[0].split(':')[1].split(regex);
    const distances = lines[1].split(':')[1].split(regex);
    for (let i = 1; i < times.length; i++) {
        races.push({
            time: Number(times[i]),
            distance: Number(distances[i])
        });
    }
    return races;
}

part1().then(result => console.log(result));