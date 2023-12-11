import * as fs from "fs";

type Race = {
  allowedTime: number;
  recordDistance: number;
};

((inputFile: string) => {
  const input = fs.readFileSync(inputFile, "utf8");
  const [timeMetadata, distanceMetadata] = input.split("\n");
  const times = timeMetadata
    .split(":")
    .map((x) => x.trim())[1]
    .split(" ")
    .filter(x => x !== "");    
  const distances = distanceMetadata
    .split(":")
    .map((x) => x.trim())[1]
    .split(" ")
    .filter(x => x !== "");

  const races: Race[] = [];

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const recordDistance = distances[i];

    races.push({
      allowedTime: Number(time),
      recordDistance: Number(recordDistance),
    });
  }

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

  console.log(`Part 1: ${totalWays}`);

})("inputp2.txt");


function calculateDistanceTravelled(timeHeld: number, raceTime: number) : number {
    const mmPerSec = timeHeld;
    const timeLeftInRace = raceTime - timeHeld;

    return mmPerSec * timeLeftInRace;
}