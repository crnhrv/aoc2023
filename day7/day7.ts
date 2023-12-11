import * as fs from 'fs';

type Card = {
    label: string;
    strength: number;
}

type Hand = {
    type: string;
    cards: Card[];
    bid: number;
}

const CARD_STRENGTH : {[key: string]: number} = {
    "A": 12,
    "K": 11,
    "Q": 10,
    "J": 9,
    "T": 8,
    "9": 7,
    "8": 6,
    "7": 5,
    "6": 4,
    "5": 3,
    "4": 2,
    "3": 1,
    "2": 0,
};

const HAND_TYPE : {[key: string]: number} = {
    "FIVE-OAK": 6,
    "FOUR-OAK": 5,
    "FULL-HOUSE": 4,
    "THREE-OAK": 3,
    "TWO-PAIR": 2,
    "ONE-PAIR": 1,
    "HIGH-CARD": 0
};


((inputFile: string, isJokerWildcard: boolean) => {
    const input = fs.readFileSync(inputFile, "utf-8");
    const handsMetadata = input.split("\n").map(x => x.trim().split(" "));

    const hands : Hand[] = [];

    for (const [hand, bid] of handsMetadata) {
        var cards : Card[] = hand.split("").map(x => { return { label: x, strength: isJokerWildcard && x === "J" ? -1 : CARD_STRENGTH[x] } });
        const handType = getHandType(cards, isJokerWildcard);
        
        hands.push({ bid: Number(bid), cards, type: handType })
    }

    hands.sort((a, b) => compareHands(a, b))

    var totalWinnings = 0;
    for (let i = 0; i < hands.length; i++) {
        const hand = hands[i];
        totalWinnings += hand.bid * (i + 1);
    }

    console.log(totalWinnings);
    
})("input.txt", true);

function compareHands(handA: Hand, handB: Hand) : number {

    if (HAND_TYPE[handA.type] > HAND_TYPE[handB.type]) {
        return 1;
    }

    if (HAND_TYPE[handA.type] < HAND_TYPE[handB.type]) {
        return -1;
    }

    for (let i = 0; i < handA.cards.length; i++) {
        const cardA = handA.cards[i];
        const cardB = handB.cards[i];

        if (cardA.strength == cardB.strength) {
            continue;
        }

        if (cardA.strength > cardB.strength) {
            return 1;
        }

        return -1
    }

    return 0;
}


function getHandType(hand: Card[], isJokerWildcard: boolean) : string {
    const [somethingOfAKind, count] = isWhatOfAKind(hand, isJokerWildcard);
    
    if (somethingOfAKind == 5) {
        return "FIVE-OAK";
    }

    if (somethingOfAKind == 4) {
        return "FOUR-OAK";
    }

    if (somethingOfAKind == 3) {
        return isFullHouse(hand, isJokerWildcard) ? "FULL-HOUSE" : "THREE-OAK";
    }

    if (somethingOfAKind == 2) {
        return count == 2 ? "TWO-PAIR" : "ONE-PAIR";
    }

    return "HIGH-CARD"
}


function isWhatOfAKind(hand: Card[], isJokerWildcard: boolean) : [number, number] {
    var pairs = 0;
    const pairedLabel = new Set<string>();

    const totalJokers = hand.filter(x => x.label == "J");

    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const sameLabel = hand.filter(x => x.label == card.label)

        if (sameLabel.length == 5) {
            return [5, 1];
        }

        if (sameLabel.length == 4) {
            if (isJokerWildcard) {
                return [card.label === "J" ? 5 : 4 + totalJokers.length, 1];
            }
            return [4, 1];
        }

        if (sameLabel.length == 3) {
            if (isJokerWildcard) {
                if (card.label === "J") {
                    return isFullHouse(hand, false) ? [5, 1] : [4, 1];
                } else {
                    return [3 + totalJokers.length, 1];
                }
            }
            return [3, 1];
        }

        if (isJokerWildcard && card.label != "J" && sameLabel.length == 2) {
            if (totalJokers.length > 0) {
                return [2 + totalJokers.length, 1];
            }
        }

        if (!pairedLabel.has(card.label) && sameLabel.length == 2) {
            pairs++;
            pairedLabel.add(card.label);
        }
    }

    if (pairedLabel.has("J")) {
        if (pairs > 0) {
            return [3, 1]
        }
    }

    if (isJokerWildcard && pairs === 0 && totalJokers.length === 1) {
        pairs++;
    }
    
    return pairs > 0 ? [2, pairs] : [1, 1];
}

function isFullHouse(hand: Card[], isJokerWildcard : boolean) : boolean {
    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const sameLabel = hand.filter(x => isJokerWildcard ? (x.label == "J" || x.label == card.label) : x.label == card.label);
        if (sameLabel.length == 3) {
            const differentLabel = hand.filter(x => isJokerWildcard ? (x.label != card.label && x.label != "J") : x.label != card.label);
            return differentLabel[0].label === differentLabel[1].label;
        }
    }

    return false;
}

