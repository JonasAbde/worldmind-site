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
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments?per_page=1`,
  { headers: { Authorization: `Bearer ${token}` } },
)
const data = await res.json()
const dep = data.result?.[0]
if (!dep) {
  console.log('No deployments yet')
} else {
  console.log(dep.latest_stage?.status, dep.url, dep.deployment_trigger?.type)
}
