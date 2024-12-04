const input = (await Bun.file('./src/2024/04/input.txt').text()).split('\n')

// 1.2
// .3.
// 4.5
function getCross(index: number) {
  return (
    straightInput[index] + // 3
    straightInput[index - lengthOfLine - 1] + // 1
    straightInput[index - lengthOfLine + 1] + // 2
    straightInput[index + lengthOfLine - 1] + // 4
    straightInput[index + lengthOfLine + 1] // 5
  )
}

const lengthOfLine = input[0].length
const straightInput = input.join('')

const possibilities: string[] = []

for (let i = 0; i < input.length; i++) {
  const line = input[i].split('')
  for (let j = 0; j < lengthOfLine; j++) {
    const letter = straightInput[lengthOfLine * i + j]
    if (letter !== 'A') continue

    if (j <= lengthOfLine - 2 && j >= 1) {
      possibilities.push(getCross(lengthOfLine * i + j))
    }
  }
}

/** 
 * Possibilities
 * 1.2
 * .3.
 * 4.5
 * 
 * M.M
 * .A.
 * S.S
 * = A M M S S
 * 
 * S.S
 * .A.
 * M.M
 * = A S S M M
 * 
 * M.S
 * .A.
 * M.S
 * = A M S M S
 * 
 * S.M
 * .A.
 * S.M
 * = A S M S M
 * 
 */

const xMas = possibilities.filter((word) => word === 'AMMSS' || word === 'ASSMM' || word === 'AMSMS' || word === 'ASMSM')
console.log(xMas.length)