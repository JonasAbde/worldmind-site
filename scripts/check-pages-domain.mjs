import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
const PROJECT_NAME = 'worldmind-site'

function getWranglerToken() {
  const configPath = path.join(
    os.homedir(),
    'AppData',
    'Roaming',
    'xdg.config',
    '.wrangler',
    'config',
    'default.toml',
  )
  const raw = fs.readFileSync(configPath, 'utf8')
  const match = raw.match(/oauth_token\s*=\s*"([^"]+)"/)
  if (!match) throw new Error('Could not read wrangler oauth token')
  return match[1]
}

async function main() {
  const token = getWranglerToken()
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  const data = await res.json()
  if (!data.success) throw new Error(JSON.stringify(data.errors ?? data, null, 2))
  for (const domain of data.result ?? []) {
    console.log(`${domain.name}: ${domain.status}`)
  }
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
