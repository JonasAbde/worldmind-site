import { ACCOUNT_ID, BUILD_COMMAND, PROJECT_NAME, cfFetch } from './cf-token.mjs'

const project = await cfFetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
)
const current = project.result.build_config?.build_command
if (current === BUILD_COMMAND) {
  console.log('Build command already includes lint.')
  process.exit(0)
}

await cfFetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`,
  {
    method: 'PATCH',
    body: JSON.stringify({
      build_config: {
        ...project.result.build_config,
        build_command: BUILD_COMMAND,
        destination_dir: 'dist',
        root_dir: '',
      },
    }),
  },
)

console.log(`Updated build command:\n  ${BUILD_COMMAND}`)
