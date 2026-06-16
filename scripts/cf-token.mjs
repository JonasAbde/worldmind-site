import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
export const PROJECT_NAME = 'worldmind-site'
export const BUILD_COMMAND = 'npm ci && npm run lint && npm run build'

export function getCloudflareToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN

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
  if (!match) throw new Error('Run npm run cf:login or set CLOUDFLARE_API_TOKEN')
  return match[1]
}

export async function cfFetch(url, options = {}) {
  const token = getCloudflareToken()
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
    throw new Error(`${options.method ?? 'GET'} ${url}\n${JSON.stringify(data.errors ?? data, null, 2)}`)
  }
  return data
}
