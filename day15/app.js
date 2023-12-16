import { getInput } from '../utils/utils.js'

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

part1().then(result => console.log(result));