type Vector = [number, number]

const input = await Bun.file('./src/2024/08/input.txt').text()

const data = input.split('\n').map((row) => row.split(''))

const uniqueTypesOfAntennas = [
  ...new Set([...input.matchAll(/[a-zA-Z]|\d/g)].map((regex) => regex[0])),
]

const coordinatesOfEachAntenna = uniqueTypesOfAntennas.map((antenna) => {
  const coordinates = data
    .map((row, rowIndex) =>
      row
        .map((cell, cellIndex): Vector | undefined => {
          if (cell === antenna) return [rowIndex, cellIndex]
          return undefined
        })
        .filter((cell) => cell !== undefined)
    )
    .flat()
  return { antenna, coordinates }
})

let antiNodes: Vector[] = []
coordinatesOfEachAntenna.forEach(({ antenna, coordinates }) => {
  const antiNodesPerType = coordinates.map(
    (coordinate, _index, coordinates) => {
      const antiNodesForCoordinate: Vector[] = []
      coordinates.forEach((entry) => {
        if (entry[0] === coordinate[0] && entry[1] === coordinate[1]) return
        const newCoords = populateLine(coordinate, entry)
        antiNodesForCoordinate.push(...newCoords)
      })
      return antiNodesForCoordinate
    }
  )
  const flatAntinodes = antiNodesPerType.flat()
  antiNodes = antiNodes.concat(flatAntinodes)
})

function populateLine(coords1: Vector, coords2: Vector): Vector[] {
  const vector: Vector = [coords2[0] - coords1[0], coords2[1] - coords1[1]]
  const vectors: Vector[] = [coords1, coords2]

  let goingForwards: Vector = coords2
  while (
    goingForwards[0] >= 0 &&
    goingForwards[0] < data.length &&
    goingForwards[1] >= 0 &&
    goingForwards[1] < data[0].length
  ) {
    const newVector: Vector = [
      goingForwards[0] + vector[0],
      goingForwards[1] + vector[1],
    ]
    vectors.push(newVector)
    goingForwards = newVector
  }

  let goingBackwards: Vector = coords1
  while (
    goingBackwards[0] >= 0 &&
    goingBackwards[0] < data.length &&
    goingBackwards[1] >= 0 &&
    goingBackwards[1] < data[0].length
  ) {
    const newVector: Vector = [
      goingBackwards[0] - vector[0],
      goingBackwards[1] - vector[1],
    ]
    vectors.push(newVector)
    goingBackwards = newVector
  }

  return vectors
}

antiNodes.forEach((node) => {
  if (
    node[0] < 0 ||
    node[0] >= data.length ||
    node[1] < 0 ||
    node[1] >= data[0].length
  )
    return
  data[node[0]][node[1]] = '#'
})

const joinedMap = data.map((row) => row.join('')).join('\n')
const amountOfAntiNodes = [...joinedMap.matchAll(/#/g)].length

console.log(amountOfAntiNodes)
