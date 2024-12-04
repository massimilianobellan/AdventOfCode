const input = (await Bun.file('./src/2024/04/input.txt').text()).split('\n')
const lengthOfLine = input[0].length
const straightInput = input.join('')

const possibilities: string[] = []
const straightInputArray = straightInput.split('')

for (let i = 0; i < input.length; i++) {
  const line = input[i].split('')
  for (let j = 0; j < lengthOfLine; j++) {
    const letter = straightInput[lengthOfLine * i + j]
    if (letter !== 'X') continue

    if (j < lengthOfLine - 4) {
      possibilities.push(getE(lengthOfLine * i + j))
      possibilities.push(getNE(lengthOfLine * i + j))
      possibilities.push(getSE(lengthOfLine * i + j))
    }
    if (j >= 3) {
      possibilities.push(getW(lengthOfLine * i + j))
      possibilities.push(getNW(lengthOfLine * i + j))
      possibilities.push(getSW(lengthOfLine * i + j))
    }
    possibilities.push(getN(lengthOfLine * i + j))
    possibilities.push(getS(lengthOfLine * i + j))
  }
}

console.log(possibilities)

const onlyXMAS = possibilities.filter((word) => word === 'XMAS')

console.log(onlyXMAS.length)

function getE(position: number) {
  return (
    straightInput[position] +
    straightInput[position + 1] +
    straightInput[position + 2] +
    straightInput[position + 3]
  )
}

function getW(position: number) {
  return (
    straightInput[position] +
    straightInput[position - 1] +
    straightInput[position - 2] +
    straightInput[position - 3]
  )
}

function getN(position: number) {
  return (
    straightInput[position] +
    straightInput[position - lengthOfLine] +
    straightInput[position - lengthOfLine * 2] +
    straightInput[position - lengthOfLine * 3]
  )
}

function getS(position: number) {
  return (
    straightInput[position] +
    straightInput[position + lengthOfLine] +
    straightInput[position + lengthOfLine * 2] +
    straightInput[position + lengthOfLine * 3]
  )
}

function getNE(position: number) {
  return (
    straightInput[position] +
    straightInput[position - lengthOfLine + 1] +
    straightInput[position - lengthOfLine * 2 + 2] +
    straightInput[position - lengthOfLine * 3 + 3]
  )
}

function getNW(position: number) {
  return (
    straightInput[position] +
    straightInput[position - lengthOfLine - 1] +
    straightInput[position - lengthOfLine * 2 - 2] +
    straightInput[position - lengthOfLine * 3 - 3]
  )
}

function getSE(position: number) {
  return (
    straightInput[position] +
    straightInput[position + lengthOfLine + 1] +
    straightInput[position + lengthOfLine * 2 + 2] +
    straightInput[position + lengthOfLine * 3 + 3]
  )
}

function getSW(position: number) {
  return (
    straightInput[position] +
    straightInput[position + lengthOfLine - 1] +
    straightInput[position + lengthOfLine * 2 - 2] +
    straightInput[position + lengthOfLine * 3 - 3]
  )
}
