import { defineStore } from 'pinia'
import Recommended from '../data/Recommended.json'

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
    startListening: false,
    activeSubView: null,
    order: []
  }),
  actions: {
    nextStep() {
      this.step++
      this.cardNumber = 0
      this.showPopup = true
      console.log(this.step)
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
    },
    setDish(dish) {
      this.selectedDish = dish
      this.nextStep()
    },
    navigateView(view) {
      if(view==='recommendation'){
        this.selectedRestaurant = Recommended.recommended[0]; // קפה איטליה
      }
      this.activeSubView=view;
    },
    saveName(name) {
      this.userName = name
    },
    addOrder(order) {
     this.order.push(order);
    }
  },
  persist: true
})
