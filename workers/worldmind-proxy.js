export default {
  async fetch(request) {
    const incoming = new URL(request.url)
    const target = new URL(request.url)
    target.hostname = 'worldmind-site.pages.dev'
    target.protocol = 'https:'

    const headers = new Headers(request.headers)
    headers.set('Host', 'worldmind-site.pages.dev')

    return fetch(
      new Request(target.toString(), {
        method: request.method,
        headers,
        body: request.body,
        redirect: 'manual',
      }),
    )
  },
}
