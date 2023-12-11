import * as fs from "fs";

type Race = {
  allowedTime: number;
  recordDistance: number;
};

((inputFile: string) => {
  const input = fs.readFileSync(inputFile, "utf8");
  const [timeMetadata, distanceMetadata] = input.split("\n");
  const times = parseMetadata(timeMetadata);
  const distances = parseMetadata(distanceMetadata);
  const races: Race[] = parseRaces(times, distances);

  var totalWays = 1;
  for (const race of races) {
    var waysToBeat = 0;
    for (let startTime = 0; startTime <= race.allowedTime; startTime++) {
        const distance = calculateDistanceTravelled(startTime, race.allowedTime);
        if (distance > race.recordDistance) {
            waysToBeat += 1;
        }
    }
    totalWays *= waysToBeat;
  }

  console.log(totalWays);

})("inputp2.txt");


function calculateDistanceTravelled(timeHeld: number, raceTime: number) : number {
    const mmPerSec = timeHeld;
    const timeLeftInRace = raceTime - timeHeld;

    return mmPerSec * timeLeftInRace;
}

function parseRaces(times: string[], distances: string[]) : Race[] {
    const races = [];
    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const recordDistance = distances[i];
    
        races.push({
          allowedTime: Number(time),
          recordDistance: Number(recordDistance),
        });
      }

    return races;
}

function parseMetadata(metadata: string) {
    return metadata
    .split(":")
    .map((x) => x.trim())[1]
    .split(" ")
    .filter(x => x !== "");    
}