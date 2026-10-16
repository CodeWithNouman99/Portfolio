import { useEffect, useState } from 'react'

// true once a HEAD request confirms `url` is served with the expected content type, else false.
// The type check matters: the dev server and SPA hosts answer missing files with index.html (200).
export default function useFileExists(url, typeIncludes) {
  const [exists, setExists] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { method: 'HEAD', cache: 'no-store', signal: controller.signal })
      .then((res) => setExists(res.ok && (res.headers.get('content-type') ?? '').includes(typeIncludes)))
      .catch(() => {}) // offline or aborted: keep hidden
    return () => controller.abort()
  }, [url, typeIncludes])

  return exists
}
