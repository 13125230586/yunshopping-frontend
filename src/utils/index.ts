export * from './storage'
export * from './format'
export * from './validate'

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(this, args)
      }, wait)
    }
  }
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return Promise.resolve()
  }
}

export function downloadFile(url: string, filename?: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename || 'download'
  link.click()
}

export function getUrlParams(url?: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(url || window.location.search)
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

export function buildUrlParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, String(params[key]))
    }
  })
  return searchParams.toString()
}