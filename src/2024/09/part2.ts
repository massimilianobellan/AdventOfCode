const input = await Bun.file('./src/2024/09/test.txt').text()

type ArrayType = (number | '.')[]

let data: ArrayType = input
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

const allIds = [...data].filter((element) => element !== '.')
let lastId = allIds[allIds.length - 1]

const newData: ArrayType = []
let index = 0
while (index < data.length) {
  if (data[index] !== '.') {
    newData.push(data[index])
  } else {
    const numberOfSpaces = getSpace(data, index)
    newData.push(String(numberOfSpaces) + '.')
  }
  index++
}

// const result = newData.reduce((prev, curr, index) => {
//   return prev + index * Number(curr)
// }, 0)

console.log(newData)

function isEven(number: number) {
  return number % 2 == 0
}

function getSpace(array: ArrayType, index: number) {
  let count = 1
  while (array[index + count] === '.') {
    count++
  }
  return count
}
