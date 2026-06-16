import { spawnSync } from 'node:child_process'

const REPO = 'JonasAbde/worldmind-site'

function gh(args) {
  const result = spawnSync('gh', args, { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `gh ${args.join(' ')} failed`)
  }
  return result.stdout.trim()
}

const raw = gh([
  'api',
  `repos/${REPO}/actions/runs`,
  '--paginate',
  '-q',
  '.workflow_runs[] | select(.conclusion=="failure") | .id',
])
const ids = raw.split('\n').filter(Boolean)
if (!ids.length) {
  console.log('No failed workflow runs to delete.')
  process.exit(0)
}

console.log(`Deleting ${ids.length} failed workflow run(s)...`)
for (const id of ids) {
  try {
    gh(['api', '-X', 'DELETE', `repos/${REPO}/actions/runs/${id}`])
    console.log(`  deleted ${id}`)
  } catch (error) {
    console.warn(`  skip ${id}: ${error.message}`)
  }
}

console.log('Done.')
