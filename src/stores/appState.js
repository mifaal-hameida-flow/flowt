import { defineStore } from 'pinia'

export const useAppState = defineStore('appState', {
  state: () => ({
    step: 0,
    showPopup: true,
    showLoader: true,
    showRecoveryPopup: false,
    cardNumber: 0,
    selectedRestaurant: null,
    selectedDish: null,
    userName: '',
    activeSubView: null,
    startListening: false,
  }),
  actions: {
    nextStep() {
      this.step++
      this.cardNumber = 0
      this.showPopup = true
    },
    clearProgress() {
      this.$reset()
    },
    continueProgress() {
      this.showRecoveryPopup = false
      this.showLoader = true
      setTimeout(() => {
        this.showLoader = false
      }, 4000)
    },
    closePopup() {
      this.showPopup = false
    },
    updateCardNumber(newNumber) {
      this.cardNumber = newNumber
    },
    setRestaurant(restaurant) {
      this.selectedRestaurant = restaurant
      if (this.step !== 5) this.nextStep()
      else this.activeSubView = 'selfChoice'
    },
    setDish(dish) {
      this.selectedDish = dish
      this.nextStep()
    },
    navigateView(view) {
      this.activeSubView = view
    },
    saveName(name) {
      this.userName = name
    }
  },
  persist: true
})
