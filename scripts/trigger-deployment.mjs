import { ACCOUNT_ID, cfFetch } from './cf-token.mjs'

const PROJECT = process.argv[2] ?? 'worldmind-site'

const data = await cfFetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`,
  { method: 'POST', body: JSON.stringify({ branch: 'main' }) },
)

const dep = data.result
console.log(`Triggered deployment ${dep?.id?.slice(0, 8) ?? 'n/a'} → ${dep?.url ?? 'pending'}`)
