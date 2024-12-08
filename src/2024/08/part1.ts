function calculateNewCoords(
  coord1: [number, number],
  coord2: [number, number]
): [[number, number], [number, number]] {
  const vector = [coord1[0] - coord2[0], coord1[1] - coord2[1]]
  const newCoords1: [number, number] = [
    coord1[0] + vector[0],
    coord1[1] + vector[1],
  ]
  const newCoords2: [number, number] = [
    coord2[0] - vector[0],
    coord2[1] - vector[1],
  ]
  return [newCoords1, newCoords2]
}

const input = await Bun.file('./src/2024/08/input.txt').text()

const data = input.split('\n').map((row) => row.split(''))

const uniqueTypesOfAntennas = [
  ...new Set([...input.matchAll(/[a-zA-Z]|\d/g)].map((regex) => regex[0])),
]

const coordinatesOfEachAntenna = uniqueTypesOfAntennas.map((antenna) => {
  const coordinates = data
    .map((row, rowIndex) =>
      row
        .map((cell, cellIndex): [number, number] | undefined => {
          if (cell === antenna) return [rowIndex, cellIndex]
          return undefined
        })
        .filter((cell) => cell !== undefined)
    )
    .flat()
  return { antenna, coordinates }
})

let antiNodes: [number, number][] = []
coordinatesOfEachAntenna.forEach(({ antenna, coordinates }) => {
  const antiNodesPerType = coordinates.map(
    (coordinate, _index, coordinates) => {
      const antiNodesForCoordinate: [number, number][] = []
      coordinates.forEach((entry) => {
        if (entry[0] === coordinate[0] && entry[1] === coordinate[1]) return
        const newCoords = calculateNewCoords(coordinate, entry)
        antiNodesForCoordinate.push(...newCoords)
      })
      return antiNodesForCoordinate
    }
  )
  const flatAntinodes = antiNodesPerType.flat()
  antiNodes = antiNodes.concat(flatAntinodes)
})

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
