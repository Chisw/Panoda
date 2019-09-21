const store = {
  get(key: string) {
    return JSON.parse(localStorage.getItem(key) || 'null')
  },

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value) )
  },

  del(key: string) {
    localStorage.setItem(key, '')
  }
}

export default store