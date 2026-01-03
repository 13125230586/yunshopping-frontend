const PREFIX = 'yunshopping_'

export const storage = {
  get(key: string) {
    try {
      const value = localStorage.getItem(PREFIX + key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('localStorage get error', error)
      return null
    }
  },

  set(key: string, value: any) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error('localStorage set error', error)
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (error) {
      console.error('localStorage remove error', error)
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('localStorage clear error', error)
    }
  },
}

export const sessionStorage = {
  get(key: string) {
    try {
      const value = window.sessionStorage.getItem(PREFIX + key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('sessionStorage get error', error)
      return null
    }
  },

  set(key: string, value: any) {
    try {
      window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error('sessionStorage set error', error)
    }
  },

  remove(key: string) {
    try {
      window.sessionStorage.removeItem(PREFIX + key)
    } catch (error) {
      console.error('sessionStorage remove error', error)
    }
  },

  clear() {
    try {
      const keys = Object.keys(window.sessionStorage)
      keys.forEach((key) => {
        if (key.startsWith(PREFIX)) {
          window.sessionStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('sessionStorage clear error', error)
    }
  },
}