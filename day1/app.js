import { getInput } from '../utils/utils.js'

async function day1() {
    const input = await getInput(1);
    const split = input.split('\n');
    let total = 0;
    for (const line of split) {
        let firstFound = false;
        let secondFound = false;
        let firstDigit = '';
        let secondDigit = '';
        for (let i = 0; i < line.length; i++) {
            const digit = line[i];
            if (digit >= '0' && digit <= '9') {
                if (!firstFound) {
                    firstDigit = digit;
                    firstFound = true;
                } else {
                    secondDigit = digit;
                    secondFound = true;
                }
            }
        }
        let number;
        if (!firstFound) {
            number = 0;
        } else if (!secondFound) {
            number = Number(firstDigit + firstDigit);
        } else {
            number = Number(firstDigit + secondDigit);
        }
        total += number;
    }
    return total;
}

day1().then(result => console.log(result));