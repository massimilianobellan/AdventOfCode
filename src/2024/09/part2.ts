const input = await Bun.file('./src/2024/09/test.txt').text()

const data: (number | ".")[] = input
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

const reversedData = [...data].reverse()
const amountOfIds = new Map<number, number>()
reversedData.forEach((id) => {
  if (id === '.') return;
  const amount = amountOfIds.get(id)
  if (amount === undefined) {
    amountOfIds.set(id, 1)
  } else {
    amountOfIds.set(id, amount + 1)
  }
})

for (let [id, amount] of amountOfIds) {
  //Find space from the start for id
  console.log(id, getIndexWhereItFits(amount))
}


// const result = newData.reduce((prev, curr, index) => {
//   return prev + index * Number(curr)
// }, 0)

console.log(data)

function isEven(number: number) {
  return number % 2 == 0
}

function getIndexWhereItFits(numberToFit: number) {
  let index: undefined | number = undefined
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    if (element !== '.') continue;

    let numberOfDots = 0;
    let nextInLine = data[i + 1]
    while (nextInLine === '.') {
      numberOfDots++
      nextInLine = data[i + 1 + numberOfDots]
    }

    if (numberOfDots <= numberToFit) {
      index = i
      break;
    }
  }
  return index;
}
