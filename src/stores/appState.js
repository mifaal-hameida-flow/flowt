import { defineStore } from 'pinia'
import Recommended from '../data/Recommended.json'
import orderHistory from '../data/OrderHistory.json'
import dayjs from 'dayjs'

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
    currOrderHistory: [],
    progressBarOpen: false,  
    selectedFilters: {
      category: null,
      rating: null,
      startDate: null,
      endDate: null
    },
    generatedQueryString: '',
    graphData: {
      orderHistoryGroupedByType: [],
      orderHistoryGroupedByMonth: [],
      orderHistoryGroupedByRestaurant: []
    },
    step3clickable: false,
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
      if (this.step !== 10) this.nextStep() // step 10 זה אחרי שבוחרים מסעדה מההיסטוריה
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
    toggleProgress(){
      this.progressBarOpen = !this.progressBarOpen;
    },
    updateFilters(filters) {
    this.selectedFilters = filters;

    const conditions = [];
    const LRM = '\u200E'; // Left-to-Right Mark


    if (filters.selectedCategory) {
      const category = filters.selectedCategory;
      conditions.push(`type = '${category}'`);
    }

    if (filters.selectedRating) {
      conditions.push(`rating >= ${filters.selectedRating}`);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate).toISOString().split('T')[0];
      conditions.push(`orderDateTime >= '${start}'`);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate).toISOString().split('T')[0];
      conditions.push(`orderDateTime <= '${end}'`);
    }
    const whereClause = conditions.length > 0 ? `WHERE\n  ${conditions.join('\n  AND ')}` : '';
    this.generatedQueryString = `SELECT * FROM Orders\n${whereClause};`;
    console.log([...this.generatedQueryString].map(c => c.charCodeAt(0)));

  },
  clearFilters() {
    this.selectedFilters = {
      category: null,
      rating: null,
      startDate: null,
      endDate: null
    };
  },
  getOrderStats() {
    const typeCount = {};
    const monthCount = {};
    const restaurantCount = {};

    orderHistory.forEach(order => {
      // ניתוח לפי סוג אוכל
      const type = order.type;
      if (typeCount[type]) {
        typeCount[type]++;
      } else {
        typeCount[type] = 1;
      }

      // לפי חודש
      const month = dayjs(order.orderDateTime).format('MM'); // "04"
      if (monthCount[month]) {
        monthCount[month]++;
      } else {
        monthCount[month] = 1;
      }

      // לפי מסעדה
      const restaurant = order.restaurantName;
      if (restaurantCount[restaurant]) {
        restaurantCount[restaurant]++;
      } else {
        restaurantCount[restaurant] = 1;
      }
    });

    // שומרים ב-state להצגה בגרפים
    this.graphData = {
      orderHistoryGroupedByType: Object.entries(typeCount).map(([type, count]) => ({
        סוג: type,
        "מספר הזמנות": count
      })),
      orderHistoryGroupedByMonth: Object.entries(monthCount).map(([month, count]) => ({
        חודש: month,
        "מספר הזמנות": count
      })),
      orderHistoryGroupedByRestaurant: Object.entries(restaurantCount).map(([name, count]) => ({
        מסעדה: name,
        "מספר הזמנות": count
      }))
    };
  }
  },
  persist: true
})
