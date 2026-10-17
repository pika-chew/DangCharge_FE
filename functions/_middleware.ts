type ProxyContext = {
  request: Request
  next: () => Promise<Response>
}

export async function onRequest({ request, next }: ProxyContext) {
  const url = new URL(request.url)
  if (!/^\/(query|command)(?:\/|$)/.test(url.pathname)) return next()
  if (!/^\/(query|command)\/api\/v1(?:\/|$)/.test(url.pathname)) {
    return new Response(null, { status: 404 })
  }

  // 전달 대상을 고정하고 인증에 필요한 헤더만 보냅니다.
  const upstreamUrl = new URL('https://api.dangcharge.cloud')
  upstreamUrl.pathname = url.pathname
  upstreamUrl.search = url.search
  const headers = new Headers()
  for (const name of ['Accept', 'Content-Type', 'Authorization']) {
    const value = request.headers.get(name)
    if (value !== null) headers.set(name, value)
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual',
      cache: 'no-store',
      signal: request.signal,
    })
    const responseHeaders = new Headers(upstream.headers)
    // 인증된 응답은 브라우저와 공유 캐시에 저장하지 않습니다.
    responseHeaders.set('Cache-Control', 'no-store')
    responseHeaders.delete('Set-Cookie')
    const location = responseHeaders.get('Location')
    if (location) {
      const redirectUrl = new URL(location, upstreamUrl)
      if (redirectUrl.origin === upstreamUrl.origin) {
        responseHeaders.set('Location', redirectUrl.pathname + redirectUrl.search + redirectUrl.hash)
      }
    }
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    })
  } catch {
    return Response.json({
      success: false,
      error: { message: 'API 서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.' },
    }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }
}
