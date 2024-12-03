const input = await Bun.file('./src/2024/03/input.txt').text()

const result = [...input.matchAll(/mul\(\d+,\d+\)/g)]
  .map((entry) => [...entry[0].matchAll(/\d+/g).map((num) => Number(num[0]))])
  .reduce((prev, curr) => prev + curr[0] * curr[1], 0)

console.log(result)
