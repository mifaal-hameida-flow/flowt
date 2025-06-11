// src/stores/main.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    currentStage: 1,
    walkthroughStep: 0,
    selectedDishes: [],
  }),
  actions: {
    nextStep() {
      this.walkthroughStep++
    },
  },
})
