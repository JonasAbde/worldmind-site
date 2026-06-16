export default {
  async fetch(request) {
    const target = new URL(request.url)
    target.hostname = 'worldmind-site.pages.dev'
    target.protocol = 'https:'

    const headers = new Headers(request.headers)
    headers.set('Host', 'worldmind-site.pages.dev')

    const response = await fetch(
      new Request(target.toString(), {
        method: request.method,
        headers,
        body: request.body,
        redirect: 'manual',
      }),
    )

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  },
}
