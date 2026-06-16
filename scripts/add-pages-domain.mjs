import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
const PROJECT_NAME = 'worldmind-site'
const CUSTOM_DOMAIN = 'worldmind.tekup.dk'
const ZONE_NAME = 'tekup.dk'

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

async function main() {
  const token = getWranglerToken()

  const zones = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}`,
  )
  const zone = zones.result?.[0]
  if (!zone) {
    throw new Error(`Zone not found in this Cloudflare account: ${ZONE_NAME}`)
  }

  console.log(`Found zone: ${zone.name} (${zone.id})`)

  const domain = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
    {
      method: 'POST',
      body: JSON.stringify({ name: CUSTOM_DOMAIN }),
    },
  )

  console.log(`Custom domain requested: ${domain.result?.name ?? CUSTOM_DOMAIN}`)
  console.log(`Status: ${domain.result?.status ?? 'pending'}`)
  console.log(`Verification: ${domain.result?.verification_data?.status ?? 'n/a'}`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
