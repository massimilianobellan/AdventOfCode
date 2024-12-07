const input = await Bun.file('./src/2024/07/input.txt').text()

const data = input.split('\n').map((row) =>
  row.split(': ').map((value, index) => {
    if (index === 0) return Number(value)
    return calculate(value.split(' ').map((number) => Number(number)))
  })
)

function calculate(numbers: number[]): number[] {
  const [number1, number2, ...restNumber] = numbers

  const add = number1 + number2
  const mult = number1 * number2
  const concatenate = Number(String(number1).concat(String(number2)))

  if (restNumber.length === 0) return [add, mult, concatenate]

  return [
    ...calculate([add, ...restNumber]),
    ...calculate([mult, ...restNumber]),
    ...calculate([concatenate, ...restNumber]),
  ]
}

const result = data
  .filter((row) => {
    const possibilities = row[1] as number[]
    const result = row[0] as number
    return possibilities.includes(result)
  })
  .reduce((prev, curr) => {
    const result = curr[0] as number
    return prev + result
  }, 0)

console.log(result)
