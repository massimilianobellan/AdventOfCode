const input = await Bun.file('./src/2024/09/input.txt').text()

const data = input
  .split('')
  .map((entry, index) => {
    const numberEntry = Number(entry)
    if (!isEven(index)) {
      return Array(numberEntry).fill('.')
    } else {
      return Array(numberEntry).fill(index / 2)
    }
  })
  .flat()

const newData: string[] = []
let index = 0
while (index < data.length) {
  if (data[index] !== '.') {
    newData.push(data[index])
  } else {
    const pop = popUntilNumber(data)
    if (pop === undefined) {
      console.error('pop is undefined at index: ', index)
      break
    }
    newData.push(pop)
  }
  index++
}

const result = newData.reduce((prev, curr, index) => {
  return prev + index * Number(curr)
}, 0)

console.log(result)

function isEven(number: number) {
  return number % 2 == 0
}

function popUntilNumber(arrayToPop: string[]) {
  const pop = arrayToPop.pop()
  if (pop === '.') return popUntilNumber(arrayToPop)
  return pop
}
