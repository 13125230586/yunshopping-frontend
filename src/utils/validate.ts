export function validateAccount(account: string): boolean {
  return /^[a-zA-Z0-9_]{4,16}$/.test(account)
}

export function validatePassword(password: string): boolean {
  return /^.{8,16}$/.test(password)
}

export function validatePhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

export function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

export function validateIdCard(idCard: string): boolean {
  return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(idCard)
}

export function validatePrice(price: number | string): boolean {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return !isNaN(num) && num >= 0 && num <= 999999.99
}

export function validateInteger(value: number | string): boolean {
  const num = typeof value === 'string' ? parseInt(value, 10) : value
  return Number.isInteger(num) && num >= 0
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}