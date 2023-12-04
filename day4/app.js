import { getInput } from '../utils/utils.js'

async function part1() {
    return parseInput(await getInput(4)).map(card => {
        const count = card.card.filter(number => card.winningNumbers.has(number)).length;
        return count === 0 ? 0 : Math.pow(2, (count - 1));
    }).reduce((sum, x) => sum + x, 0);
}

function parseInput(input) {
    return input.split('\n').filter(string => string).map(line => {
        const parts = line.split(': ')[1].split(' | ');
        return {
            card: parts[1].split(' ').filter(string => string).map(number => Number(number)),
            winningNumbers: new Set(parts[0].split(' ').filter(string => string).map(number => Number(number)))
        }
    });
}

part1().then(result => console.log(result));