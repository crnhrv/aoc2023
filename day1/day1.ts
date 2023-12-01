import * as fs from "fs";

function main(input_file: string) {
  const input = fs.readFileSync(input_file, "utf8");
  const lines = input.split("\n");

  const numbers: { [key: string]: string } = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };

  const sum = lines.reduce((accumulator: number, line: string) => {
    const elements = line.split("");

    let first = null;
    let last = null;

    let j = elements.length;
    for (let i = 0; i <= elements.length; i++) { 
        
      if (first && last) {
        break;
      }
        
      const leftElement = elements[i];
      const rightElement = elements[j];

      first = !first && !isNaN(Number(leftElement)) ? leftElement : first;
      last = !last && !isNaN(Number(rightElement)) ? rightElement : last;

      for (const key in numbers) {
        const checkLength = key.length;

        if (!first) {
          const possibleLeftDigit = elements
          .slice(i, i + checkLength)
          .join("");

          if (possibleLeftDigit == key) {
            first = numbers[key];
          }
        }

        if (!last) {
          const possibleRightDigit = elements
            .slice(j - checkLength, j)
            .join("");

          if (possibleRightDigit == key) {
            last = numbers[key];
          }
        }
      }

      j--;

    }

    const full_number = Number(first! + last!);

    return full_number + accumulator;
  }, 0);

  console.log(sum);
}

main("test.txt");
main("input.txt");
