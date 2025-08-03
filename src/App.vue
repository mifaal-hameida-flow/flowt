<script setup>
import PopupGuide from './components/PopupGuide.vue'
import PopupGuideContent from './data/PopupGuideContent.json'
import HomeView from './views/HomeView.vue'
import Loader from './components/Loader.vue'
import RestaurantDetailsView from './views/RestaurantDetailsView.vue'
import DishDetails from './views/DishDetails.vue'
import RecommendedView from './views/RecommendedView.vue'
import PersonalArea from './views/PersonalArea.vue'
import UserProgress from './components/UserProgress.vue'
import { popupState } from './stores/popup'
import { computed, onMounted, watch } from 'vue'
import { useAppState } from './stores/appState'

const state = useAppState()

const stepInfo = computed(() => PopupGuideContent[state.step])

const currentViewComponent = computed(() => {
  if (state.step >= 2 && state.step < 4) return RestaurantDetailsView
  if (state.step === 4) return RecommendedView
  if (state.step === 5) return RestaurantDetailsView
  if (state.step >= 6 && state.step < 9) return DishDetails
  if (state.step >= 9 && state.step < 11) return PersonalArea
  if (state.step >= 11) return RecommendedView
  // if (state.step >=10) return RestaurantDetailsView
  return HomeView
})

const transitionName = computed(() => state.step === 6 ? 'page-flip' : 'fade-slide')

const handleClick = () => {
  if (state.progressBarOpen) {
    state.progressBarOpen = false;
  }
}
watch(
  [() => state.step, () => state.showPopup],
  ([newStep, popupVisible]) => {
    if (newStep === 5 && !popupVisible) {
      state.startListening = true;
    } else {
       state.startListening = false;
    }
  },
  { immediate: true }
);

watch(currentViewComponent, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' }) 
})

onMounted(() => {
   document.addEventListener('gesturestart', (e) => e.preventDefault());
  const hasSavedData = !!localStorage.getItem('appState')
  if (hasSavedData) {
    state.showRecoveryPopup = true
  }
  if (state.step === 0) {
    state.showRecoveryPopup = false
    state.showLoader = true
  }
  setTimeout(() => {
      state.showLoader = false
  }, 4000)
})
</script>

<template>
  <Loader v-if="state.showLoader && !state.showRecoveryPopup" />

  <div v-if="state.showRecoveryPopup" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
      <h2 class="text-lg font-bold mb-4">ברוכים השבים!</h2>
      <p class="mb-6">נראה שכבר התחלתם. רוצים להמשיך מאיפה שהפסקתם או להתחיל מההתחלה?</p>
      <div class="flex justify-between gap-4">
        <button @click="state.clearProgress()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          התחלה מחדש
        </button>
        <button @click="state.continueProgress()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          המשך
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="!state.showLoader">
     <!-- למצוא לזה מקום -->
    <Transition :name="transitionName" mode="out-in">
      <component @click="handleClick" :is="currentViewComponent"/>
    </Transition>
    <UserProgress/> 
    <PopupGuide
      v-if="(state.showPopup || popupState.isVisible) && stepInfo"
      :key="state.step"
      :stepInfo="stepInfo"
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

.page-flip-enter-active,
.page-flip-leave-active {
  transition: transform 0.6s ease, opacity 0.4s ease;
  transform-style: preserve-3d;
  transform-origin: bottom center;
}

.page-flip-enter-from {
  transform: rotateX(-90deg);
  opacity: 0;
}

.page-flip-enter-to {
  transform: rotateX(0deg);
  opacity: 1;
}

.page-flip-leave-from {
  transform: rotateX(0deg);
  opacity: 1;
}

.page-flip-leave-to {
  transform: rotateX(-90deg);
  opacity: 0;
}

</style>