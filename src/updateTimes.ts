import { readdir } from 'node:fs/promises'

async function getTimeToRun(filePath: string) {
  const start = Date.now()
  const result = Bun.spawnSync(['bun', 'run', filePath])
  return Date.now() - start
}

async function getTimeForFile(filePath: string) {
  const day = Number(filePath.split('/')[0])

  const fileName = filePath.split('/')[1]
  const part = Number(fileName.match(/(?<=part)\d+/g)?.[0])

  if (isNaN(part)) {
    console.error(`Can't read part of file: ${filePath}`)
    process.exit(0)
  }

  const time = await getTimeToRun(`${basePath}/${filePath}`)

  const fileForDay = filesPerDay[day]
  if (fileForDay === undefined) {
    filesPerDay[day] = [{ part, time }]
  } else {
    filesPerDay[day] = [...fileForDay, { part, time }]
  }
}

function generateMarkdownTable(
  data: Record<string, { part: number; time: number }[]>
): string {
  const allParts = new Set<number>()
  Object.values(data).forEach((entries) =>
    entries.forEach((entry) => allParts.add(entry.part))
  )
  const sortedParts = Array.from(allParts).sort((a, b) => a - b)

  let markdown =
    '| Day | ' + sortedParts.map((part) => `Part ${part}`).join(' | ') + ' |\n'
  markdown += '|-----|' + sortedParts.map(() => '--------').join('|') + '|\n'

  for (const day in data) {
    const row = new Array(sortedParts.length).fill('')
    data[day].forEach((entry) => {
      const partIndex = sortedParts.indexOf(entry.part)
      row[partIndex] = `${entry.time} ms`
    })
    markdown += `| ${day}   | ${row.join(' | ')} |\n`
  }

  return markdown
}

export function updateReadmeFromTemplate({ table2024 }: { table2024: string }) {
  return `# Advent of Code

To install dependencies:

\`\`\`bash
bun install
\`\`\`

To run a day:

\`\`\`bash
bun run src/{year}/{day}/{part1 / part2}.ts
\`\`\`

To update the times in the table below:

\`\`\`bash
bun run updateTimes {year}
\`\`\`

# Performances

## 2024

${table2024}
This project was created using \`bun init\` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
`
}

if (process.argv.length != 3) {
  console.error('Usage: bun run updateTimes {year}')
  process.exit(0)
}

const year = Number(process.argv[2])
if (isNaN(year)) {
  console.error(`Cannot parse year: ${process.argv[2]}`)
  process.exit(0)
}

const basePath = `./src/${year}`

const tsFiles = (await readdir(basePath, { recursive: true }))
  .map((fileName) => fileName.match(/(.*).ts/g))
  .filter((fileName) => fileName !== null)

const filesPerDay: Record<number, { part: number; time: number }[]> = {}
for (const file of tsFiles) {
  await getTimeForFile(file[0])
}

const markDownTable = generateMarkdownTable(filesPerDay)

const readme = Bun.write(
  './README.md',
  updateReadmeFromTemplate({ table2024: markDownTable })
)
