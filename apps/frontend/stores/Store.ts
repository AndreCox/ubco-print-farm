//set up mobx store
import { makeAutoObservable, autorun, reaction } from 'mobx'

class Store {
  authenticated = false

  constructor() {
    makeAutoObservable(this)
  }
}

export const store = new Store()
