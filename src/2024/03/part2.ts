const input = await Bun.file('./src/2024/03/input.txt').text()

console.time('day3')

const intstructions = [
  ...input.matchAll(/(do\(\)|don't\(\))|(mul\(\d+,\d+\))/g),
].map((entry) => entry[0])

let enabled = true
let enabledInstructions: string[] = []
intstructions.forEach((entry) => {
  if (entry === "don't()") enabled = false
  if (entry === 'do()') enabled = true
  if (enabled && entry !== "don't()" && entry !== 'do()') {
    enabledInstructions.push(entry)
  }
})

const result = enabledInstructions
  .map((entry) => [...entry.matchAll(/\d+/g).map((num) => Number(num[0]))])
  .reduce((prev, curr) => prev + curr[0] * curr[1], 0)

console.log(result)

console.timeEnd('day3')
