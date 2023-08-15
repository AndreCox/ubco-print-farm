//set up mobx store
import { makeAutoObservable, observable } from 'mobx'

class Store {
  authenticated = false
  admin = false

  constructor() {
    makeAutoObservable(this)
  }
}

export const store = new Store()
