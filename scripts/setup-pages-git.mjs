import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const ACCOUNT_ID = '1cd2e6c70a2918567a3edcf8eadd7458'
const PROJECT = 'worldmind-site'
const REPO_OWNER = 'JonasAbde'
const REPO_NAME = 'worldmind-site'
const REPO_ID = '1271185997'
const OWNER_ID = '147070826'

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
    throw new Error(`${options.method ?? 'GET'} ${url}\n${JSON.stringify(data.errors ?? data, null, 2)}`)
  }
  return data
}

async function waitForDeployment(token, project, timeoutMs = 600_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const deployments = await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${project}/deployments?per_page=1`,
    )
    const dep = deployments.result?.[0]
    if (dep) {
      const status = dep.latest_stage?.status ?? dep.stage
      console.log(`  deployment ${dep.id.slice(0, 8)}: ${status}`)
      if (status === 'success') return dep
      if (status === 'failure' || status === 'canceled') {
        throw new Error(`Deployment failed: ${dep.id}`)
      }
    }
    await new Promise((r) => setTimeout(r, 15_000))
  }
  throw new Error('Timed out waiting for deployment')
}

async function main() {
  const token = getToken()

  console.log(`Migrating ${PROJECT} to Cloudflare Git integration (no GitHub Actions)...\n`)

  try {
    await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}`,
      { method: 'DELETE' },
    )
    console.log('Deleted direct-upload project.')
  } catch (error) {
    if (!String(error.message).includes('8000007')) throw error
    console.log('No existing project to delete.')
  }

  await cfFetch(token, `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects`, {
    method: 'POST',
    body: JSON.stringify({
      name: PROJECT,
      production_branch: 'main',
      build_config: {
        build_command: 'npm ci && npm run build',
        destination_dir: 'dist',
        root_dir: '',
      },
      source: {
        type: 'github',
        config: {
          owner: REPO_OWNER,
          owner_id: OWNER_ID,
          repo_name: REPO_NAME,
          repo_id: REPO_ID,
          production_branch: 'main',
          deployments_enabled: true,
          production_deployments_enabled: true,
          preview_deployment_setting: 'none',
          pr_comments_enabled: false,
        },
      },
    }),
  })
  console.log('Created git-connected Pages project.')

  await new Promise((r) => setTimeout(r, 5000))
  const deployments = await cfFetch(
    token,
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments?per_page=1`,
  )
  if (!deployments.result?.length) {
    console.log('Triggering initial deployment from main...')
    await cfFetch(
      token,
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
      { method: 'POST', body: JSON.stringify({ branch: 'main' }) },
    )
  }

  console.log('Waiting for Cloudflare build from GitHub main...')

  const dep = await waitForDeployment(token, PROJECT)
  console.log(`\nProduction live: https://${PROJECT}.pages.dev`)
  console.log(`Deployment URL: ${dep.url}`)
  console.log('\nPushes to main now auto-deploy via Cloudflare (not GitHub Actions).')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
