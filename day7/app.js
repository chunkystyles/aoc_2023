import { getInput } from '../utils/utils.js'

async function part1() {
    const hands = parseInput(await getInput(7)).sort(compareHands);
    let total = 0;
    for (let i = 0; i < hands.length; i++) {
        total += (i + 1) * hands[i].bid;
    }
    return total;
}

function parseInput(input) {
    const hands = [];
    input.split('\n').forEach(line => {
        const parts = line.split(' ');
        const cards = parts[0].split('').map(card => mapCardToNumber(card));
        if (cards.length > 0) {
            const bid = Number(parts[1]);
            const counts = new Map();
            cards.forEach(card => {
                if (counts.has(card)) {
                    counts.set(card, counts.get(card) + 1);
                } else {
                    counts.set(card, 1);
                }
            });
            const countsArray = Array.from(counts, ([key, value]) => (value)).sort(compareNumbers).reverse();
            hands.push({
                cards: cards,
                bid: bid,
                tier: getHandTier(countsArray)
            })
        }
    });
    return hands;
}

function mapCardToNumber(card) {
    if (card <= '9' && card >= '2') {
        return Number(card);
    } else if (card === 'T') {
        return 10;
    } else if (card === 'J') {
        return 11;
    } else if (card === 'Q') {
        return 12;
    } else if (card === 'K') {
        return 13;
    } else if (card === 'A') {
        return 14;
    }
}

function getHandTier(counts) {
    if (counts[0] === 5) {
        return 6;
    } else if (counts[0] === 4) {
        return 5;
    } else if (counts[0] === 3) {
        if (counts[1] ===  2) {
            return 4;
        } else {
            return 3;
        }
    } else if (counts[0] === 2) {
        if (counts[1] === 2) {
            return 2;
        } else {
            return 1;
        }
    } else {
        return 0;
    }
}

function compareHands(a, b) {
    const tierCompare = compareNumbers(a.tier, b.tier);
    if (tierCompare !== 0) {
        return tierCompare;
    } else {
        for (let i = 0; i < a.cards.length; i++) {
            const cardCompare = compareNumbers(a.cards[i], b.cards[i]);
            if (cardCompare !== 0) {
                return cardCompare;
            }
        }
        return 0;
    }
}

function compareNumbers(a, b) {
    if (a > b) {
        return 1;
    } else if (a === b) {
        return 0;
    } else {
        return -1;
    }
}

part1().then(result => console.log(result));