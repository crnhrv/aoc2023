import * as fs from "fs";

function main(inputFile: string) {
  const input = fs.readFileSync(inputFile, "utf-8");
  const schematic = input.split("\n").map((line) => line.split(""));

  const partNumberCount: { [key: string]: number } = {};
  const partNumberGears: { [key: string] : Set<string>} = {};
  var allGears = new Set<string>();

  for (let y = 0; y < schematic.length; y++) {
    const line = schematic[y];
    for (let x = 0; x < line.length; x++) {
      if (isNumber(schematic[y][x])) {
        var currentX = x;
        var nearbySymbols = new Set<string>();
        var nearbyGears = new Set<string>();

        while (isNumber(schematic[y][currentX])) {
          const [adjacentSymbols, adjacentGears] = getAdjacentSymbols(currentX, y, schematic);
          nearbySymbols = new Set([...nearbySymbols, ...adjacentSymbols]);
          nearbyGears = new Set([...nearbyGears, ...adjacentGears]);
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

        partNumberGears[`${partNumber}_${y},${x}-${currentX}`] = nearbyGears;
        var allGears = new Set<string>([...allGears, ...nearbyGears]);

        x = currentX;
      }
    }
  }
  
  var answer1 = 0;
  var answer2 = 0;


  for (const part in partNumberCount) {
    if (partNumberCount[part] > 0) {
        answer1 += (Number(part) * partNumberCount[part]);
    }        
  }

  for (const gear of allGears) {
    var count = 0
    var localSum = 1;
    for (const part in partNumberGears) {
        const partGears = partNumberGears[part];
        if (partGears.has(gear)) {
            localSum *= Number(part.split("_")[0])
            count++;
        }
    }
    
    if (count > 1) {
        answer2 += localSum;
    }
  }

  console.log(answer1);
  console.log(answer2);
}

function getAdjacentSymbols(
  x: number,
  y: number,
  schematic: string[][]
): [Set<string>, Set<string>] {
  let symbolChars = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,<>\/?~]/;
  const foundSymbols = new Set<string>();
  const foundGears = new Set<string>();

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

        if (schematic[newY][newX] == "*") {
            foundGears.add(`${newX}, ${newY}`)
        }
    }
  }

  return [foundSymbols, foundGears];
}

function isNumber(char: string): boolean {
  return !isNaN(Number(char));
}

function IsOutOfBounds(x: number, y: number, maxY: number, maxX: number) {
  return x >= maxX || y >= maxY || x <= -1 || y <= -1;
}

main("./test-input.txt");
main("./input.txt");