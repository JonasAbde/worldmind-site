import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const sourceDir = path.join(root, 'public', 'assets')
const outDir = path.join(sourceDir, 'optimized')

const qualityByFile = {
  'worldmind-hero-key-art.png': 76,
  'new-aarhus-district-01.png': 72,
  'missing-delivery-case-board.png': 72,
  'leno-evidence-guard.png': 72,
  'simulation-hud-memory-permissions.png': 72,
  'timeline-branches.png': 72,
  'save-browser-snapshot-diff.png': 72,
  'npc-agent-portrait-set.png': 72,
}

async function main() {
  await fs.mkdir(outDir, { recursive: true })
  const entries = await fs.readdir(sourceDir)
  const pngFiles = entries.filter((name) => name.endsWith('.png'))

  const beforeAfter = []

  for (const file of pngFiles) {
    const sourcePath = path.join(sourceDir, file)
    const outputName = file.replace(/\.png$/i, '.webp')
    const outputPath = path.join(outDir, outputName)
    const quality = qualityByFile[file] ?? 72

    await sharp(sourcePath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath)

    const sourceStat = await fs.stat(sourcePath)
    const outputStat = await fs.stat(outputPath)

    beforeAfter.push({
      file,
      originalBytes: sourceStat.size,
      webpBytes: outputStat.size,
      savings: sourceStat.size - outputStat.size,
    })
  }

  console.log('Optimized PNG -> WebP:')
  for (const row of beforeAfter) {
    const originalMb = (row.originalBytes / (1024 * 1024)).toFixed(2)
    const webpMb = (row.webpBytes / (1024 * 1024)).toFixed(2)
    const savedPct = ((row.savings / row.originalBytes) * 100).toFixed(1)
    console.log(`- ${row.file}: ${originalMb} MB -> ${webpMb} MB (${savedPct}% saved)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
