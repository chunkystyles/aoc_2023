import { getInput } from '../utils/utils.js'

async function part1() {
    return parseInput(await getInput(4)).map(card => {
        const count = card.card.filter(number => card.winningNumbers.has(number)).length;
        return count === 0 ? 0 : Math.pow(2, (count - 1));
    }).reduce((sum, x) => sum + x, 0);
}

async function part2() {
    const cards = parseInput(await getInput(4));
    let total = 0;
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        total += card.copies;
        const matches = card.card.filter(number => card.winningNumbers.has(number)).length;
        for (let j = 1; j + i < cards.length && j <= matches; j++) {
            cards[j + i].copies += card.copies;
        }
    }
    return total;
}

function parseInput(input) {
    return input.split('\n').filter(string => string).map(line => {
        const parts = line.split(': ')[1].split(' | ');
        return {
            card: parts[1].split(' ').filter(string => string).map(number => Number(number)),
            winningNumbers: new Set(parts[0].split(' ').filter(string => string).map(number => Number(number))),
            copies: 1
        }
    });
}

part2().then(result => console.log(result));