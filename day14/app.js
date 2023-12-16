import { getInput } from '../utils/utils.js'

const roundRock = 'O';
const squareRock = '#';
const openSpace = '.';
let map;
let start;

async function part1() {
    const map = parseInput(await getInput(14));
    const levels = Array(map[0].length).fill(0);
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const char = map[y][x];
            if (char === roundRock) {
                if (levels[x] < y) {
                    map[levels[x]][x] = roundRock;
                    map[y][x] = openSpace;
                }
                levels[x] += 1;
            } else if (char === squareRock) {
                levels[x] = y + 1;
            }
        }
    }
    let value = map.length;
    let total = 0;
    for (const row of map) {
        total += (value * row.filter(char => char === roundRock).length);
        value--;
    }
    return total;
}

async function part2() {
    const values = new Map();
    map = parseInput(await getInput(14));
    let loops = 1000000000;
    let key;
    let cycleDetected = false;
    let cycleKey;
    let period = 1;
    let pattern = [];
    let final;
    for (let i = 0; i < loops; i++) {
        key = createKey();
        cycle();
        if (!cycleDetected) {
            if (!values.has(key)) {
                values.set(key, calculateLoad());
            } else {
                cycleDetected = true;
                cycleKey = key;
                pattern.push(key);
            }
        } else {
            if (key === cycleKey) {
                const left = loops - i - 1;
                const mod = left % period;
                final = values.get(pattern[mod]);
                break;
            } else {
                period++;
                pattern.push(key);
            }
        }
    }
    let end = new Date().getTime();
    console.log(`${end - start} ms`);
    return final;
}

function createKey() {
    let key = '';
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === roundRock) {
                if (key) {
                    key += ':';
                }
                key += `${y},${x}`;
            }
        }
    }
    return key;
}

function cycle() {
    rotateNorth();
    rotateWest();
    rotateSouth();
    rotateEast();
}

function rotateNorth() {
    const levels = Array(map[0].length).fill(0);
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const char = map[y][x];
            if (char === roundRock) {
                if (levels[x] < y) {
                    map[levels[x]][x] = roundRock;
                    map[y][x] = openSpace;
                }
                levels[x] += 1;
            } else if (char === squareRock) {
                levels[x] = y + 1;
            }
        }
    }
}

function rotateEast() {
    const levels = Array(map.length).fill(map.length - 1);
    for (let x = map[0].length - 1; x >= 0; x--) {
        for (let y = 0; y < map.length; y++) {
            const char = map[y][x];
            if (char === roundRock) {
                if (levels[y] > x) {
                    map[y][levels[y]] = roundRock;
                    map[y][x] = openSpace;
                }
                levels[y] -= 1;
            } else if (char === squareRock) {
                levels[y] = x - 1;
            }
        }
    }
}

function rotateSouth() {
    const levels = Array(map[0].length).fill(map[0].length - 1);
    for (let y = map.length - 1; y >= 0; y--) {
        for (let x = 0; x < map[y].length; x++) {
            const char = map[y][x];
            if (char === roundRock) {
                if (levels[x] > y) {
                    map[levels[x]][x] = roundRock;
                    map[y][x] = openSpace;
                }
                levels[x] -= 1;
            } else if (char === squareRock) {
                levels[x] = y - 1;
            }
        }
    }
}

function rotateWest() {
    const levels = Array(map.length).fill(0);
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map.length; y++) {
            const char = map[y][x];
            if (char === roundRock) {
                if (levels[y] < x) {
                    map[y][levels[y]] = roundRock;
                    map[y][x] = openSpace;
                }
                levels[y] += 1;
            } else if (char === squareRock) {
                levels[y] = x + 1;
            }
        }
    }
}

function calculateLoad() {
    let value = map.length;
    let total = 0;
    for (const row of map) {
        total += (value * row.filter(char => char === roundRock).length);
        value--;
    }
    return total;
}

function parseInput(input) {
    start = new Date().getTime();
    return input.split('\n').filter(line => line).map(line => line.split(''));
}

part2().then(result => console.log(result));