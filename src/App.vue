
<script setup>
import PopupGuide from './components/PopupGuide.vue';
import PopupGuideContent from './data/PopupGuideContent.json';
import HomeView from './views/HomeView.vue';
import Loader from './components/Loader.vue';
import {ref, onMounted, computed, watch} from 'vue';
import RestaurantDetailsView from './views/RestaurantDetailsView.vue';
import DishDetails from './views/DishDetails.vue';
import { popupState } from './stores/popup';
import RecommendedView from './views/RecommendedView.vue';

const step = ref(0);
const showLoader = ref(true);
const showRecoveryPopup = ref(false);
const cardNumber = ref(0);
const selectedRestaurant = ref(null);
const showPopup = ref(true);
const activeSubView = ref(null);
const startListening = ref(false);
const userName = ref(false);

const stepInfo = computed(() => {
  const info = PopupGuideContent[step.value];
  return info;
});

const updateCardNumber = (newNumber) => {
  cardNumber.value = newNumber;
  localStorage.setItem('cardNumber', newNumber);
};

const nextStep = () => {
  step.value++;
  showPopup.value = true;
  updateCardNumber(0); // reset card
  localStorage.setItem('currentStep', step.value); // Save step
}

const closePopup = () => {
   showPopup.value = false;
}

const clearProgress = () => {
  localStorage.removeItem('currentStep');
  localStorage.removeItem('userName');
  localStorage.removeItem('chosenRestaurant');
  step.value = 0;
  showRecoveryPopup.value = false;
  setTimeout(() => {
      showLoader.value = false;
    }, 4000);
};

const continueProgress = () => {
  const savedStep = localStorage.getItem('currentStep');
  const savedName = localStorage.getItem('userName');
  const savedCard = localStorage.getItem('cardNumber');
  const savedRestaurant = localStorage.getItem('chosenRestaurant');
  const savedView = localStorage.getItem('chosenView');
  if (savedStep !== null) {
    step.value = parseInt(savedStep, 10);
  }
  if (savedCard !== null) {
    cardNumber.value = parseInt(savedCard, 10);
  }
    if (savedRestaurant !== null) {
    const parsedRestaurant = JSON.parse(savedRestaurant);
    selectedRestaurant.value = parsedRestaurant;
  }
  
  if (savedName !== null) {
    userName.value = savedName;
  }

   if (savedView !== null) {
    activeSubView.value = savedView;
  }

  showRecoveryPopup.value = false;
  setTimeout(() => {
    showLoader.value = false;
  }, 4000);
};

const handleRestaurantSelection = (restaurant) => {
  selectedRestaurant.value = restaurant;
  localStorage.setItem('chosenRestaurant', JSON.stringify(selectedRestaurant.value));
  if (step.value !== 5) {
    nextStep();
  } else {
    activeSubView.value= 'selfChoice'
  }
};

const currentViewComponent = computed(() => {
  if (step.value >= 2 && step.value < 4 ) return RestaurantDetailsView;
  if (step.value === 4) return RecommendedView;
  if (step.value === 5) {
    return activeSubView.value === 'recommendation' ? RecommendedView : RestaurantDetailsView;
  }
  // DishDetails
  return HomeView;
});

const navigateView = (viewId) => {
  activeSubView.value = viewId; // 'recommendation' or 'self-choice'
  localStorage.setItem('chosenView', activeSubView.value);
};

const saveName = (username) => {
  userName.value = username; // 'recommendation' or 'self-choice'
  localStorage.setItem('userName', userName.value);
}

watch([step, showPopup], ([newStep, popupVisible]) => {
  if (newStep === 5 && !popupVisible) {
    startListening.value = true;
  }
}, { immediate: true });

onMounted(() => {
  const savedStep = localStorage.getItem('currentStep');
  const savedName = localStorage.getItem('userName');
  const savedCard = localStorage.getItem('cardNumber');
  const savedRestaurant = localStorage.getItem('chosenRestaurant');
  const savedView = localStorage.getItem('chosenView');
 
  if (savedStep || savedName || savedRestaurant || savedView || savedCard) {
    showRecoveryPopup.value = true;
  } else {
    setTimeout(() => {
      showLoader.value = false;
    }, 4000);
  }
});

</script>

<template>
  <Loader v-if="showLoader && !showRecoveryPopup"/> 
  <div v-if="showRecoveryPopup" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
      <h2 class="text-lg font-bold mb-4">ברוכים השבים!</h2>
      <p class="mb-6">נראה שכבר התחלתם. רוצים להמשיך מאיפה שהפסקתם או להתחיל מההתחלה?</p>
      <div class="flex justify-between gap-4">
        <button @click="clearProgress" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          התחלה מחדש
        </button>
        <button @click="continueProgress" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          המשך
        </button>
      </div>
    </div>
  </div>
  
  <div v-if="!showLoader">
    <Transition name="fade-slide" mode="out-in">
       <component :is="currentViewComponent" 
        @restaurant-selected="handleRestaurantSelection" 
        @next-step="nextStep"
        :stepNumber="step"
        :restaurantInfo="selectedRestaurant" 
        :popupShowing="showPopup"
        :shouldListen="startListening" />
    </Transition>
   
    <!-- <HomeView v-if="currentViewComponent === HomeView" @restaurant-selected="handleRestaurantSelection" :stepNumber="step"/>
    <RestaurantDetailsView v-else-if="currentViewComponent === RestaurantDetailsView" :restaurantInfo="selectedRestaurant" :stepNumber="step" :popupShowing="showPopup" @next-step="nextStep"/> -->
    <PopupGuide
       v-if="(showPopup || popupState.isVisible) && stepInfo"
      :key="step" 
      :stepInfo="stepInfo"
      :initial-card="cardNumber"
      :restaurantInfo="selectedRestaurant"
      :card="popupState.manualCard"
      :name="userName || null"
      :view="activeSubView || null"
      @next-step="nextStep"
      @close-popup="closePopup"
      @card-number="updateCardNumber"
      @view="navigateView"
      @username="saveName"
    />
  </div>
</template>


<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

</style>