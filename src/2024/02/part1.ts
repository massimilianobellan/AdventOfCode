const input = await Bun.file('./src/2024/02/input.txt').text()

const data = input
  .split('\n')
  .map((row) =>
    row
      .split(' ')
      .map((element, index, row) => {
        if (index === row.length - 1) {
          return undefined
        }
        return Number(element) - Number(row[index + 1])
      })
      .filter((element) => element !== undefined)
  )
  .map((row) => {
    let valid = true

    if (
      !row.every((element) => Math.abs(element) >= 1 && Math.abs(element) <= 3)
    ) {
      valid = false
    }

    if (
      !(
        row.every((element) => element < 0) ||
        row.every((element) => element > 0)
      )
    ) {
      valid = false
    }

    return valid
  })

const total = data.reduce((prev, curr) => {
  if (curr) {
    return prev + 1
  }
  return prev
}, 0)

console.log(total)
