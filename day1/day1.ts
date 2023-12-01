import * as fs from 'fs';

function main(input_file: string) {
    const input = fs.readFileSync(input_file, 'utf8');
    const lines = input.split("\n");

    const numbers: { [key: string]: string } = { "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9" };

    const sum = lines.reduce((accumulator: number, line: string) => {
        const elements = line.split("");

        let first = "";            
        let last = "";

        for (let i = 0; i <= elements.length; i++) {
            const element = elements[i];
            if (!isNaN(Number(element))) {
                first = element;
                break;
            } else {
                for (const key in numbers) {
                    const checkLength = key.length;
                    const possibleDigit = elements.slice(i, i + checkLength).join("");
                    if (possibleDigit == key) {
                        first = numbers[key];
                        break;
                    };         
                }
                if (first.length > 0) {
                    break;
                }
            }         
        }           

        for (let i = elements.length; i >= 0; i--) {
            const element = elements[i];
            if (!isNaN(Number(element))) {
                last = element;
                break;
            } else {
                for (const key in numbers) {
                    const checkLength = key.length;
                    const possibleDigit = elements.slice(i - checkLength, i).join("");
                    if (possibleDigit == key) {
                        last = numbers[key];
                        break;
                    };         
                }

                if (last.length > 0) {
                    break;
                }
            }
        }

        const full_number = Number(first + last);

        return (full_number + accumulator);
    }, 0)   

    console.log(sum)
}

main("test.txt")
main("input.txt")
