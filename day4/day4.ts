import * as fs from "fs";

type ScratchCard = {
    id: number;
    copies: number,
    winningNumbers: Set<number>;
    actualNumbers: Set<number>;
}

function main(inputFile: string) {
    const input = fs.readFileSync(inputFile, "utf-8").trim();
    const cards = createCards(input)

    var totalPoints = 0;
    var totalCards = 0;

    cards.forEach((card, currentCardIndex) => {
        const matchingNumbers = [...card.actualNumbers].filter(x => card.winningNumbers.has(x));
        totalPoints += matchingNumbers.length > 0 ? Math.pow(2, (matchingNumbers.length - 1)) : 0;      
        
        for (let i = 0; i < card.copies; i++) {
            var nextCardIndex = currentCardIndex + 1; 
            for (let j = 0; j < matchingNumbers.length; j++) {
                cards[nextCardIndex].copies += 1;
                nextCardIndex++;                
            }
        }
        totalCards += card.copies;
    })

    console.log(totalPoints);
    console.log(totalCards);
}

function createCards(input: string): ScratchCard[] {
    return input.split("\n").map(x => {
        const [metadata, values] = x.split(":");
        const id = metadata.split(" ").pop();

        var [winners, actual] = values.split(" | ");
        const winningNumbers = new Set<number>(getCardNumbers(winners));
        const actualNumbers = new Set<number>(getCardNumbers(actual));  

        return {
            id: Number(id),
            winningNumbers,
            actualNumbers,
            copies: 1
        };
    });
}

function getCardNumbers(input: string) : number[] {
    return input.trim()
    .split(" ")
    .filter(x => x != "")
    .map(Number);
}

main("./test-input.txt")
main("./input.txt")
