// 입력을 받는다.
const fs = require("fs");
const inputPath = `${__dirname}/input.txt`;
const strLine = fs.readFileSync(inputPath).toString().split("\n");

const n = parseInt(strLine[0], 10);
const arr = strLine[1].split(" ").map((n) => parseInt(n, 10));

let sumNum = arr[0];
const answer = [arr[0]];

for (let i = 1; i < n; i++) {
  answer.push(arr[i] * (i + 1) - sumNum);
  sumNum += answer[i];
}

console.log(...answer);
