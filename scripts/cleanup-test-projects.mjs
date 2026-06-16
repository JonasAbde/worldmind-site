import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'

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
  const match = raw.match(/oauth_token\s*=\s*"([^"]+)"/)
  if (!match) throw new Error('Run npm run cf:login first')
  return match[1]
}

async function cfFetch(token, url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors ?? data, null, 2))
  }
  return data
}

const token = getToken()
for (const name of ['worldmind-site-git-test']) {
  try {
    await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${name}`,
      { method: 'DELETE' },
    )
    console.log(`Deleted ${name}`)
  } catch (error) {
    console.log(`${name}: ${error.message}`)
  }
}
