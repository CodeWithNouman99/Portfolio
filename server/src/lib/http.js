// Error carrying an HTTP status; the error middleware turns it into { error } JSON.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// fetch with a hard timeout
export async function fetchWithTimeout(url, options = {}, ms = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
