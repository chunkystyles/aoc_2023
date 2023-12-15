import { getInput } from '../utils/utils.js'

const roundRock = 'O';
const squareRock = '#';
const openSpace = '.';

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

function parseInput(input) {
    return input.split('\n').filter(line => line).map(line => line.split(''));
}

part1().then(result => console.log(result));