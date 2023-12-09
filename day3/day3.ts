import * as fs from "fs";

function main(inputFile: string) {
  const input = fs.readFileSync(inputFile, "utf-8");
  const schematic = input.split("\n").map((line) => line.split(""));

  const partNumberCount: { [key: string]: number } = {};

  for (let y = 0; y < schematic.length; y++) {
    const line = schematic[y];
    for (let x = 0; x < line.length; x++) {
      if (isNumber(schematic[y][x])) {
        var currentX = x;
        var nearbySymbols = new Set<string>();

        while (isNumber(schematic[y][currentX])) {
          const adjacentSymbols = getAdjacentSymbols(currentX, y, schematic);
          nearbySymbols = new Set([...nearbySymbols, ...adjacentSymbols]);
          currentX++;
        }

        if (x == currentX) {
          continue;
        }

        const partNumber = line.slice(x, currentX).join("");
        if (partNumberCount[partNumber]) {
          partNumberCount[partNumber] += nearbySymbols.size;
        } else {
          partNumberCount[partNumber] = nearbySymbols.size;
        }
        x = currentX;
      }
    }
  }
  
  var answer1 = 0;
  for (const part in partNumberCount) {
    if (partNumberCount[part] > 0) {
        answer1 += (Number(part) * partNumberCount[part]);
    }
  }

  console.log(answer1);
}

function getAdjacentSymbols(
  x: number,
  y: number,
  schematic: string[][]
): Set<string> {
  let symbolChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,<>\/?~]/;
  const foundSymbols = new Set<string>();
  const deltas = [
    [+1, 0],
    [-1, 0],
    [0, +1],
    [0, -1],
    [+1, +1],
    [-1, -1],
    [+1, -1],
    [-1, +1],
  ];

  for (const [deltaX, deltaY] of deltas) {
    const [newX, newY] = [x + deltaX, y + deltaY];

    if (IsOutOfBounds(newX, newY, schematic.length, schematic[0].length)) {
      continue;
    }

    if (symbolChars.test(schematic[newY][newX])) {
        foundSymbols.add(`${newX}, ${newY}`);
    }
  }

  return foundSymbols;
}

function isNumber(char: string): boolean {
  return !isNaN(Number(char));
}

function IsOutOfBounds(x: number, y: number, maxY: number, maxX: number) {
  return x >= maxX || y >= maxY || x <= -1 || y <= -1;
}

main("./test-input.txt");
main("./input.txt");