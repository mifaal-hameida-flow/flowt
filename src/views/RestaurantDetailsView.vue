<script setup>
import DishCard from '../components/DishCard.vue';
import { Truck, Star } from 'lucide-vue-next'; 
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ref, toRef, watch, onUnmounted, onMounted } from 'vue';
import BottomBar from '../components/BottomBar.vue';
import { popupState } from '../stores/popup';
import { useAppState } from '../stores/appState'; 
const state = useAppState();

const showBottomBar = ref(false);
const showTooltip = ref(false);
const shouldListen = toRef(state, 'startListening') // make it a ref

watch(
  () => state.showPopup,
  (newVal) => {
    if (state.step === 3 && !newVal) {
      setTimeout(() => {
        showBottomBar.value = true;
      }, 800); // Delay before showing BottomBar
    }
  },
  { immediate: true }
);


let idleTimeout = null;
let isListening = false;

// === Idle Timer Logic ===
const startIdleTimer = () => {
  clearTimeout(idleTimeout);

  idleTimeout = setTimeout(() => {
    if (!popupState.isVisible && !state.showPopup) {

      popupState.manualCard = {
        id: 'idle-step-5',
        title: 'נו למה אתם מחכים?',
        message: ['בחרו מנה שתרצו להזמין 🍽️'],
        buttonTask: {
          msg: 'יאללה נזמין אוכל',
          src: '././media/buttons/order.png'
        }
      };

      popupState.isVisible = true;
    } 
  }, 60000); // adjust as needed
};

const resetIdleTimer = () => {
  clearTimeout(idleTimeout);

  if (popupState.manualCard?.id?.startsWith('idle') && popupState.isVisible) {
    popupState.isVisible = false;
  }

  startIdleTimer();
};

const listenToUser = () => {
  if (!isListening) {
    window.addEventListener('click', resetIdleTimer);
    isListening = true;
  }

  startIdleTimer();
};

const stopListening = () => {
  clearTimeout(idleTimeout);

  if (isListening) {
    window.removeEventListener('click', resetIdleTimer);
    isListening = false;
  }
};


watch(shouldListen, (val) => {
  if (val) {
    listenToUser();
  } else {
    stopListening();
  }
}, { immediate: true });



onUnmounted(() => {
  stopListening();
});


const handleBottomBarEntered = () => {
  showTooltip.value = true;
}

const translateSection = (section) => {
  const map = {
    firstCourses: "מנות ראשונות",
    mainCourses: "מנות עיקריות",
    desserts: "קינוחים"
  };
  return map[section] || section;
}

const nextStep = () => {
  state.nextStep();
}

const handleDishSelection = (dish) => {
  if (state.step !== 3) {
    state.setDish(dish);
  }
}

</script>
<template>

  <div v-if="state.step < 3" class="absolute flex items-center justify-center top-0 w-screen h-screen">
      <DotLottieVue style="height: 850px; width: 850px" autoplay :loop="false" src="https://lottie.host/1610322f-bc11-40b6-854d-2239a01f0699/niGnJbbie4.lottie"/>
  </div>

 <div v-else class="min-h-screen bg-white">
    <!-- Header Image -->
    <div class="relative flex-col justify-center items-center">
        <svg class="absolute w-0 h-0">
        <defs>
            <clipPath id="inward-arc" clipPathUnits="objectBoundingBox">
            <path
              d="M0,0 H1 V1 
                A1,0.3 0 0,0 0,1 
                Z"
            />

            </clipPath>
        </defs>
        </svg>

        <img
        :src="state.selectedRestaurant.src"
        alt="Header"
        class="w-full h-full object-cover"
        style="clip-path: url(#inward-arc);"
        />
      <div class="absolute bottom-[-0.75rem] flex w-full justify-center">
        <img class="w-26 h-26 rounded-xl shadow" :src="state.selectedRestaurant.logo" alt="logo">
      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="p-4 text-center">
      <h1 class="text-2xl font-extrabold mt-2">{{ state.selectedRestaurant.name }} | {{ state.selectedRestaurant.location }}</h1>
      
      <div class="flex justify-center flex-wrap gap-1.5 text-sm text-gray-700 mt-4">
        <span>⭐ {{ state.selectedRestaurant.rating }}</span>
        <span class="mx-1 text-gray-400">•</span>
        <span>{{ state.selectedRestaurant.priceRange }}</span>
        <span class="mx-1 text-gray-400">•</span>
        <span>{{ state.selectedRestaurant.deliveryTime }} דקות משלוח</span>
         <span class="mx-1 text-gray-400">•</span>
        <span>{{ state.selectedRestaurant.type }}</span>
        <span class="mx-1 text-gray-400">•</span>
        <span class="flex items-center">
          <Truck class="w-4 h-4 text-gray-600 -scale-x-100 pr-1" />
          {{ state.selectedRestaurant.deliveryPrice }} 
          </span>
      </div>
      <div class="w-full flex justify-center">
         <button class="flex items-center align-center text-center mt-2 bg-[#E6F8FA] text-[#48cae4] px-4 py-2 rounded-md text-sm">
         <Truck class="w-4 h-4 text-[#48cae4] -scale-x-100 pr-1" />
        משלוח משוער {{ state.selectedRestaurant.deliveryTime }} דקות
      </button>
      </div>
    </div>

    <div class="px-4 mt-4 space-y-8">
      <!-- Loop menu keys -->
      <div v-for="(dishes, section) in state.selectedRestaurant.menu" :key="section">
        <h2 class="text-lg font-bold mb-4">
          {{ translateSection(section) }}
        </h2>
        <div class="grid gap-2">
          <DishCard
            v-for="(dish, index) in dishes" :key="index" :dish="dish"
            @click="handleDishSelection(dish)"
          />
        </div>
      </div>
    </div>
    <transition name="slide-up" @after-enter="handleBottomBarEntered">
      <!--         
        :step="stepNumber"
        :show-tooltip="showTooltip" -->
      <BottomBar
        v-if="showBottomBar"
        :show-tooltip="showTooltip" 
        @next-step="nextStep"
      />
    </transition>
  </div>
</template>


<style scoped>
.slide-up-enter-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}
</style>
