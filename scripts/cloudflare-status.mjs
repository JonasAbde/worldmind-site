import { ACCOUNT_ID, PROJECT_NAME, cfFetch } from './cf-token.mjs'

const CUSTOM_DOMAIN = 'worldmind.tekup.dk'
const ZONE_NAME = 'tekup.dk'

async function main() {
  console.log('=== Cloudflare Pages status ===\n')

  const project = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
  )
  console.log(`Project: ${project.result.name}`)
  console.log(`Subdomain: https://${project.result.subdomain}`)
  console.log(`Production branch: ${project.result.production_branch ?? 'n/a'}`)
  const sourceType = project.result.source?.type ?? 'direct_upload'
  const buildCommand = project.result.build_config?.build_command ?? 'n/a'
  console.log(
    `Source: ${sourceType}${project.result.source?.config?.repo_name ? ` (${project.result.source.config.owner}/${project.result.source.config.repo_name})` : ''}`,
  )
  console.log(`Build: ${buildCommand}`)

  const domains = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
  )
  console.log('\nCustom domains:')
  if (!domains.result?.length) {
    console.log('  (none on Pages — Worker may route production traffic)')
  }
  for (const d of domains.result ?? []) {
    console.log(`  - ${d.name}: ${d.status}`)
  }

  const deployments = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments?per_page=3`,
  )
  console.log('\nRecent deployments:')
  for (const dep of deployments.result ?? []) {
    console.log(`  - ${dep.environment} | ${dep.url} | ${dep.latest_stage?.status ?? dep.stage}`)
  }

  try {
    const workerDomains = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains`,
    )
    const host = workerDomains.result?.find((d) => d.hostname === CUSTOM_DOMAIN)
    console.log('\nWorker custom domain (production routing):')
    if (host) {
      console.log(`  - ${host.hostname} → ${host.service} (enabled: ${host.enabled})`)
    } else {
      console.log(`  - ${CUSTOM_DOMAIN}: not attached`)
    }
  } catch {
    console.log('\nWorker custom domain: (could not query)')
  }

  const zones = await cfFetch(`https://api.cloudflare.com/client/v4/zones?name=${ZONE_NAME}`)
  const zone = zones.result?.[0]
  if (zone) {
    try {
      const records = await cfFetch(
        `https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records?name=${CUSTOM_DOMAIN}`,
      )
      console.log(`\nDNS for ${CUSTOM_DOMAIN}:`)
      if (!records.result?.length) {
        console.log('  (no record — run npm run cf:dns or npm run cf:migrate-domain)')
      } else {
        for (const r of records.result) {
          console.log(`  - ${r.type} ${r.name} → ${r.content} (proxied: ${r.proxied})`)
        }
      }
    } catch {
      console.log(`\nDNS for ${CUSTOM_DOMAIN}: (token lacks Zone DNS read)`)
      console.log('  Worker proxy handles routing, or run npm run cf:migrate-domain with DNS API token')
    }
  }

  console.log('\n=== Live URLs ===')
  console.log(`  https://${PROJECT_NAME}.pages.dev`)
  console.log(`  https://${CUSTOM_DOMAIN}`)
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
