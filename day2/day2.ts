import * as fs from "fs";

function main(inputFile: string) {
  const input = fs.readFileSync(inputFile, "utf8");
  const lines = input.split("\n");

  var answer = 0;
  var answerTwo: number[] = [];

  for (const line of lines) {
    const [gameMetadata, roundMetadata] = line.split(":");
    const id = Number(gameMetadata.split(" ").pop());
    const rounds = roundMetadata.split(";");

    var isPossibleGame = true;

    const minNeededForGame: { [key: string]: number } = {
      green: 0,
      red: 0,
      blue: 0,
    };

    for (const round of rounds) {
      const maxForPossibleGame: { [key: string]: number } = {
        green: 13,
        red: 12,
        blue: 14,
      };

      const moves = round.split(",");

      for (const move of moves) {
        const [amount, colour] = move.trim().split(" ");
        maxForPossibleGame[colour] -= Number(amount);
        minNeededForGame[colour] = Math.max(
          minNeededForGame[colour],
          Number(amount)
        );
      }

      if (
        maxForPossibleGame["green"] < 0 ||
        maxForPossibleGame["blue"] < 0 ||
        maxForPossibleGame["red"] < 0
      ) {
        isPossibleGame = false;
      }
    }

    const powerCube =
      minNeededForGame["red"] *
      minNeededForGame["blue"] *
      minNeededForGame["green"];

    answerTwo.push(powerCube);

    if (isPossibleGame) {
      answer += id;
    }
  }

  console.log(answerTwo.reduce((previous, current) => previous + current, 0));
  console.log(answer);
}

main("./input.txt");
