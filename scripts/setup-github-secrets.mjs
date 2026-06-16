import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'

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

function setSecret(name, value) {
  const result = spawnSync('gh', ['secret', 'set', name], {
    input: value,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
  if (result.status !== 0) throw new Error(`Failed to set secret: ${name}`)
}

try {
  const token = getWranglerToken()
  setSecret('CLOUDFLARE_API_TOKEN', token)
  setSecret('CLOUDFLARE_ACCOUNT_ID', ACCOUNT_ID)
  console.log('GitHub secrets configured for Cloudflare deploy workflow.')
} catch (error) {
  console.error(error.message ?? error)
  process.exitCode = 1
}
