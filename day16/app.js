import {getInput, stringify2dArray} from '../utils/utils.js'
import {Queue} from '@datastructures-js/queue';

let map;
let energies = [];
const energized = '#';
const beams = new Queue();
const cache = new Set();
let start;

async function part1() {
    map = parseInput(await getInput(16));
    for (const row of map) {
        energies.push([]);
        for (const char of row) {
            energies[energies.length - 1].push('.');
        }
    }
    addBeam({x: -1, y: 0, direction: 'east'});
    while (beams.size() > 0) {
        let beam = beams.dequeue();
        let nextPoint;
        let nextChar;
        let directionChanged;
        while (true) {
            nextPoint = getNextPoint(beam);
            if (nextPoint.x < 0 || nextPoint.y < 0) {
                break;
            }
            energies[nextPoint.y][nextPoint.x] = energized;
            nextChar = map[nextPoint.y][nextPoint.x];
            directionChanged = true;
            beam.x = nextPoint.x;
            beam.y = nextPoint.y;
            switch (nextChar) {
                case '-':
                    switch (beam.direction) {
                        case 'north':
                            beam.direction = 'east';
                            addBeam({x: nextPoint.x, y: nextPoint.y, direction: 'west'});
                            break;
                        case 'south':
                            beam.direction = 'west';
                            addBeam({x: nextPoint.x, y: nextPoint.y, direction: 'east'});
                            break;
                        default:
                            directionChanged = false;
                            break;
                    }
                    break;
                case '|':
                    switch (beam.direction) {
                        case 'east':
                            beam.direction = 'south';
                            addBeam({x: nextPoint.x, y: nextPoint.y, direction: 'north'});
                            break;
                        case 'west':
                            beam.direction = 'north';
                            addBeam({x: nextPoint.x, y: nextPoint.y, direction: 'south'});
                            break;
                        default:
                            directionChanged = false;
                            break;
                    }
                    break;
                case '/':
                    switch (beam.direction) {
                        case 'north':
                            beam.direction = 'east';
                            break;
                        case 'east':
                            beam.direction = 'north';
                            break;
                        case 'south':
                            beam.direction = 'west';
                            break;
                        case 'west':
                            beam.direction = 'south';
                            break;
                        default:
                            directionChanged = false;
                            break;
                    }
                    break;
                case '\\':
                    switch (beam.direction) {
                        case 'north':
                            beam.direction = 'west';
                            break;
                        case 'east':
                            beam.direction = 'south';
                            break;
                        case 'south':
                            beam.direction = 'east';
                            break;
                        case 'west':
                            beam.direction = 'north';
                            break;
                        default:
                            directionChanged = false;
                            break;
                    }
                    break;
                default:
                    directionChanged = false;
                    break;
            }
            if (directionChanged) {
                addBeam(beam);
                break;
            }
        }
    }
    const total = calculateEnergies();
    const end = new Date().getTime();
    console.log(`${end - start} ms`);
    return total;
}

function getNextPoint(beam) {
    let nextPoint;
    switch (beam.direction) {
        case 'north':
            nextPoint = {x: beam.x, y: beam.y - 1};
            break;
        case 'east':
            nextPoint = {x: beam.x + 1, y: beam.y};
            break;
        case 'south':
            nextPoint = {x: beam.x, y: beam.y + 1};
            break;
        default:
            nextPoint = {x: beam.x - 1, y: beam.y};
            break;
    }
    if (nextPoint.x < 0 || nextPoint.x >= map[0].length || nextPoint.y < 0 || nextPoint.y >= map.length) {
        return {x: -1, y: -1};
    } else {
        return nextPoint;
    }
}

function parseInput(input) {
    start = new Date().getTime();
    return input.split('\n').filter(line => line).map(line => line.split(''));
}

function calculateEnergies() {
    let total = 0;
    energies.forEach(line => total += line.filter(char => char === energized).length);
    return total;
}

function addBeam(beam) {
    const key = createKey(beam);
    if (!cache.has(key)) {
        cache.add(key);
        beams.enqueue(beam);
    }
}

function createKey(beam) {
    return `${beam.y}-${beam.x}-${beam.direction}`;
}

part1().then(result => console.log(result));