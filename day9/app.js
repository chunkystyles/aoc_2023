import { getInput, writeJsonFile } from '../utils/utils.js'

async function part1() {
    const histories = parseInput(await getInput(9));
    for (const history of histories) {
        while (true) {
            const newLevel = [];
            const currentLevel = history[history.length - 1];
            for (let i = 0; i < currentLevel.length - 1; i++) {
                newLevel.push(currentLevel[i + 1] - currentLevel[i]);
            }
            history.push(newLevel);
            if (newLevel.filter(value => value !== 0).length === 0) {
                break;
            }
        }
    }
    let total = 0;
    for (const history of histories) {
        for (let i = history.length - 1; i > 0; i--) {
            history[i - 1].push(history[i][history[i].length - 1] + history[i - 1][history[i - 1].length - 1]);
        }
        total += history[0][history[0].length - 1];
    }
    return total;
}

async function part2() {
    const histories = parseInput(await getInput(9));
    for (const history of histories) {
        while (true) {
            const newLevel = [];
            const currentLevel = history[history.length - 1];
            for (let i = 0; i < currentLevel.length - 1; i++) {
                newLevel.push(currentLevel[i + 1] - currentLevel[i]);
            }
            history.push(newLevel);
            if (newLevel.filter(value => value !== 0).length === 0) {
                break;
            }
        }
    }
    let total = 0;
    for (const history of histories) {
        for (let i = history.length - 1; i > 0; i--) {
            history[i - 1].unshift(history[i - 1][0] - history[i][0]);
        }
        total += history[0][0];
    }
    return total;
}

function parseInput(input) {
    return input.split('\n').filter(string => string).map(string => string.split(' ').map(string => Number(string))).map(history => [history]);
}

part2().then(result => console.log(result));