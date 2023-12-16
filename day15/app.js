import { getInput } from '../utils/utils.js'
const boxes = [];

async function part1() {
    const input = parseInput(await getInput(15));
    let total = 0;
    input.forEach(string => total += hash(string));
    return total;
}

function hash(string) {
    let value = 0;
    for (let i = 0; i < string.length; i++) {
        value += string.charCodeAt(i);
        value *= 17;
        value %= 256;
    }
    return value;
}

function parseInput(input) {
    return input.replaceAll('\n', '').split(',').filter(string => string);
}

async function part2() {
    const instructions = parseInput(await getInput(15));
    for (let i = 0; i < 256; i++){
        boxes.push([]);
    }
    for (const instruction of instructions) {
        if (instruction.includes('-')) {
            const label = instruction.substring(0, instruction.length - 1);
            const index = hash(label);
            for (let i = 0; i < boxes[index].length; i++) {
                if (boxes[index][i].label === label) {
                    boxes[index].splice(i, 1);
                    break;
                }
            }
        } else {
            const split = instruction.split('=');
            const label = split[0];
            const power = Number(split[1]);
            const index = hash(label);
            let found = false;
            for (let i = 0; i < boxes[index].length; i++) {
                if (boxes[index][i].label === label) {
                    found = true;
                    boxes[index][i].power = power;
                    break;
                }
            }
            if (!found) {
                boxes[index].push({label: label, power: power});
            }
        }
    }
    return calculateFocusingPower();
}

function calculateFocusingPower() {
    let total = 0;
    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes[i].length; j++) {
            if (boxes[i][j]) {
                total += (i + 1) * (j + 1) * boxes[i][j].power;
            }
        }
    }
    return total;
}

part2().then(result => console.log(result));