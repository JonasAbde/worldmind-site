import { ACCOUNT_ID, PROJECT_NAME, cfFetch } from './cf-token.mjs'

const CUSTOM_DOMAIN = 'worldmind.tekup.dk'
const ZONE_ID = '437f019a3c388abd3eb7d8b486dfc787'
const PAGES_TARGET = `${PROJECT_NAME}.pages.dev`

async function ensureDns() {
  let records
  try {
    records = await cfFetch(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?name=${CUSTOM_DOMAIN}`,
    )
  } catch {
    throw new Error(
      'Set CLOUDFLARE_API_TOKEN with Zone DNS Edit, then re-run:\n  $env:CLOUDFLARE_API_TOKEN="..."; npm run cf:migrate-domain',
    )
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
    if (record.type === 'CNAME' && record.content === PAGES_TARGET && record.proxied) {
      console.log(`DNS OK: ${record.name} → ${record.content}`)
      return
    }
    if (record.type === 'CNAME') {
      await cfFetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${record.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: PAGES_TARGET, proxied: true }),
      })
      console.log(`Updated CNAME → ${PAGES_TARGET}`)
      return
    }
  }

  throw new Error(`Unexpected DNS records for ${CUSTOM_DOMAIN}. Fix manually in Cloudflare DNS.`)
}

async function waitForPagesActive(timeoutMs = 300_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const domains = await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
    )
    const domain = domains.result?.find((d) => d.name === CUSTOM_DOMAIN)
    const status = domain?.status ?? 'missing'
    const verify = domain?.verification_data?.status ?? 'n/a'
    console.log(`  Pages domain: ${status} (verify: ${verify})`)
    if (status === 'active') return domain
    if (status === 'error' || status === 'blocked') {
      throw new Error(`Pages domain failed: ${JSON.stringify(domain)}`)
    }
    await new Promise((r) => setTimeout(r, 15_000))
  }
  throw new Error('Timed out waiting for Pages domain to become active')
}

async function ensurePagesDomain() {
  const domains = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
  )
  if (!domains.result?.find((d) => d.name === CUSTOM_DOMAIN)) {
    await cfFetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/domains`,
      { method: 'POST', body: JSON.stringify({ name: CUSTOM_DOMAIN }) },
    )
    console.log(`Registered Pages domain: ${CUSTOM_DOMAIN}`)
  }
}

async function removeWorkerDomain() {
  const workerDomains = await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains`,
  )
  const host = workerDomains.result?.find((d) => d.hostname === CUSTOM_DOMAIN)
  if (!host) {
    console.log('Worker custom domain already removed.')
    return
  }
  await cfFetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/domains/${host.id}`,
    { method: 'DELETE' },
  )
  console.log(`Removed Worker custom domain (${host.service}).`)
}

async function main() {
  console.log(`Migrating ${CUSTOM_DOMAIN} to Pages-native domain...\n`)

  await ensureDns()
  await ensurePagesDomain()
  console.log('Waiting for Pages SSL/DNS verification...')
  await waitForPagesActive()
  await removeWorkerDomain()

  console.log('\nMigration complete.')
  console.log(`  https://${CUSTOM_DOMAIN} → Cloudflare Pages`)
  console.log('Optional: remove [[routes]] from wrangler.worker.toml')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exitCode = 1
})
