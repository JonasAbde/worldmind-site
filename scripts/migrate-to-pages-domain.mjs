import { ACCOUNT_ID, PROJECT_NAME, cfFetch } from './cf-token.mjs'

const CUSTOM_DOMAIN = 'worldmind.tekup.dk'
const ZONE_ID = '437f019a3c388abd3eb7d8b486dfc787'
const PAGES_TARGET = `${PROJECT_NAME}.pages.dev`
const WORKER_NAME = 'worldmind-proxy'

async function ensureDns() {
  let records
  try {
    records = await cfFetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=${CUSTOM_DOMAIN}`,
    )
  } catch (error) {
    if (!process.env.CLOUDFLARE_API_TOKEN) {
      throw new Error(
        'DNS API needs CLOUDFLARE_API_TOKEN with Zone DNS Edit. Keep Worker proxy or add CNAME manually in dashboard.',
      )
    }
    throw error
  }

  if (!records.result?.length) {
    await cfFetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: 'CNAME',
        name: 'worldmind',
        content: PAGES_TARGET,
        proxied: true,
        ttl: 1,
      }),
    })
    console.log(`Created CNAME worldmind → ${PAGES_TARGET}`)
    return
  }

  for (const record of records.result) {
    if (record.type === 'CNAME' && record.content !== PAGES_TARGET) {
      await cfFetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${record.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: PAGES_TARGET, proxied: true }),
      })
      console.log(`Updated CNAME → ${PAGES_TARGET}`)
    } else {
      console.log(`DNS OK: ${record.type} ${record.name} → ${record.content}`)
    }
  }
}

async function ensurePagesDomain() {
  const domains = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
  )
  const existing = domains.result?.find((d) => d.name === CUSTOM_DOMAIN)
  if (existing?.status === 'active') {
    console.log(`Pages domain already active: ${CUSTOM_DOMAIN}`)
    return
  }
  if (!existing) {
    await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
      { method: 'POST', body: JSON.stringify({ name: CUSTOM_DOMAIN }) },
    )
    console.log(`Registered Pages domain: ${CUSTOM_DOMAIN}`)
  } else {
    console.log(`Pages domain status: ${existing.status}`)
  }
}

async function removeWorkerDomain() {
  const workerDomains = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains`,
  )
  const host = workerDomains.result?.find((d) => d.hostname === CUSTOM_DOMAIN)
  if (!host) {
    console.log('No Worker custom domain to remove.')
    return
  }

  await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains/${host.id}`,
    { method: 'DELETE' },
  )
  console.log(`Removed Worker custom domain from ${WORKER_NAME}.`)
  console.log('Redeploy worker without custom domain: npm run deploy:worker (after editing wrangler.worker.toml)')
}

async function main() {
  console.log(`Migrating ${CUSTOM_DOMAIN} from Worker proxy to Pages-native domain...\n`)
  await ensureDns()
  await ensurePagesDomain()
  await removeWorkerDomain()
  console.log('\nMigration steps applied. Allow a few minutes for SSL to provision.')
  console.log('Verify: npm run cf:status')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
