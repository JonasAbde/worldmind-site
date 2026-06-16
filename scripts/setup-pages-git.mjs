import { ACCOUNT_ID, BUILD_COMMAND, PROJECT_NAME, cfFetch } from './cf-token.mjs'

const REPO_OWNER = 'JonasAbde'
const REPO_NAME = 'worldmind-site'
const REPO_ID = '1271185997'
const OWNER_ID = '147070826'

async function waitForDeployment(project, timeoutMs = 600_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const deployments = await cfFetch(
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

async function triggerMainDeploy(project) {
  await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${project}/deployments`,
    { method: 'POST', body: JSON.stringify({ branch: 'main' }) },
  )
}

async function main() {
  console.log(`Migrating ${PROJECT_NAME} to Cloudflare Git integration (no GitHub Actions)...\n`)

  try {
    await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
      { method: 'DELETE' },
    )
    console.log('Deleted direct-upload project.')
  } catch (error) {
    if (!String(error.message).includes('8000007')) throw error
    console.log('No existing project to delete.')
  }

  await cfFetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects`, {
    method: 'POST',
    body: JSON.stringify({
      name: PROJECT_NAME,
      production_branch: 'main',
      build_config: {
        build_command: BUILD_COMMAND,
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
  console.log('Triggering initial deployment from main...')
  await triggerMainDeploy(PROJECT_NAME)
  console.log('Waiting for Cloudflare build...')

  const dep = await waitForDeployment(PROJECT_NAME)
  console.log(`\nProduction live: https://${PROJECT_NAME}.pages.dev`)
  console.log(`Deployment URL: ${dep.url}`)
  console.log('\nPushes to main now auto-deploy via Cloudflare (not GitHub Actions).')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
