import { getInput } from '../utils/utils.js'

const constraints = {
    "red": 12,
    "green": 13,
    "blue": 14
}

async function part1() {
    const input = await getInput(2);
    const games = parseInput(input);
    let total = 0;
    games.forEach(game => {
       let possible = true;
       game.rounds.some(round => {
           for (const [key, value] of Object.entries(constraints)) {
               if (round[key] && round[key] > value) {
                   possible = false;
                   break;
               }
           }
           return !possible; // Used to break out of .some() which stops if return true
       });
       if (possible) {
           total += game.number;
       }
    });
    return total;
}

function parseInput(input) {
    let games = [];
    input.split('\n').forEach(line => {
        if (line) {
            const firstPart = line.split(':');
            let game = {
                number: Number(firstPart[0].split(' ')[1]),
                rounds: []
            };
            firstPart[1].split(';').forEach(roundString => {
                let round = {};
                roundString.split(',').map(s => s.trim()).forEach(s => {
                    const pullSplit = s.split(' ');
                    round[pullSplit[1]] = Number(pullSplit[0]);
                });
                game.rounds.push(round);
            });
            games.push(game);
        }
    });
    return games;
}

part1().then(result => console.log(result));