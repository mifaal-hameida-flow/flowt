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
    deliveryFee: null,
    selectedDish: null,
    userName: '',
    startListening: false,
    activeSubView: null,
    currOrder: [],      
    orderHistory: []   
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
      this.selectedRestaurant = restaurant;
      const priceString = restaurant.deliveryPrice;
      if (priceString === "חינם") {
        this.deliveryFee = 0;
      } else {
        // Extract numeric value (e.g. from "10.00₪" → 10.00)
        const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
        this.deliveryFee = isNaN(numericValue) ? 0 : numericValue;
      }
      if (this.step !== 5) this.nextStep();
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
  },
  persist: true
})
