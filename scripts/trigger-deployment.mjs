import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
const PROJECT = process.argv[2] ?? 'worldmind-site-git-test'

function getToken() {
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
  return raw.match(/oauth_token\s*=\s*"([^"]+)"/)?.[1]
}

const token = getToken()
const res = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch: 'main' }),
  },
)
const data = await res.json()
console.log(res.status, JSON.stringify(data, null, 2).slice(0, 1500))
