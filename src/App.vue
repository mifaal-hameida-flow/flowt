
<script setup>
import PopupGuide from './components/PopupGuide.vue';
import PopupGuideContent from './data/PopupGuideContent.json';
import HomeView from './views/HomeView.vue';
import Loader from './components/Loader.vue';
import {ref, onMounted} from 'vue';

const step = ref(0);
const showLoader = ref(true);
const showRecoveryPopup = ref(false);
const cardNumber = ref(0);

const updateCardNumber = (newNumber) => {
  cardNumber.value = newNumber;
  localStorage.setItem('cardNumber', newNumber);
};

const nextStep = () => {
  step.value++;
  localStorage.setItem('currentStep', step.value); // Save step
}

const clearProgress = () => {
  localStorage.removeItem('currentStep');
  localStorage.removeItem('userName');
  step.value = 0;
  showRecoveryPopup.value = false;
  setTimeout(() => {
      showLoader.value = false;
    }, 4000);
};

const continueProgress = () => {
  const savedStep = localStorage.getItem('currentStep');
  const savedCard = localStorage.getItem('cardNumber');

  if (savedStep !== null) {
    step.value = parseInt(savedStep, 10);
  }
  if (savedCard !== null) {
    cardNumber.value = parseInt(savedCard, 10);
  }

  showRecoveryPopup.value = false;
  setTimeout(() => {
    showLoader.value = false;
  }, 4000);
};


onMounted(() => {
  const savedStep = localStorage.getItem('currentStep');
  const savedName = localStorage.getItem('userName');
 
  if (savedStep || savedName) {
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
  
  <div v-else>
    <HomeView/>
    <popupGuide
      :stepInfo="PopupGuideContent[step]"
      :initial-card="cardNumber"
      @next-step="nextStep"
      @card-number="updateCardNumber"
    />
  </div>

</template>


