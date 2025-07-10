<script setup>
import RestaurantCard from '../components/RestaurantCard.vue'
import recommendations from '../data/Recommended.json'
import TopBar from '../components/TopBar.vue'
import BottomBar from '../components/BottomBar.vue'
import { popupState } from '../stores/popup';
import { toRef, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAppState } from '../stores/appState'; 

const state = useAppState();
const isScrolled = ref(false);
const shouldListen = toRef(state, 'startListening') // make it a ref

const sections = [
  { title: 'הזמנה חוזרת', key: 'recent' },
  { title: 'מומלץ עבורך', key: 'recommended' },
  { title: 'פופולרי עכשיו', key: 'popular' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

let idleTimeout = null;
let isListening = false;

// === Idle Timer Logic ===
const startIdleTimer = () => {
  clearTimeout(idleTimeout);

  idleTimeout = setTimeout(() => {
    if (!popupState.isVisible && !props.popupShowing) {

      popupState.manualCard = {
        id: 'idle-step-5',
        title: 'נו למה אתם מחכים?',
        message: ['בחרו מסעדה ואז מנה שתרצו להזמין 🍽️'],
        buttonTask: {
          msg: 'יאללה נזמין אוכל',
          src: '././media/buttons/order.png'
        }
      };

      popupState.isVisible = true;
    } 
  }, 5000); // adjust as needed
};

const resetIdleTimer = () => {
  clearTimeout(idleTimeout);

  if (popupState.isVisible) {
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

const selectRestaurant = (restaurant) => {
  if (state.step !== 4) {
  state.setRestaurant(restaurant);
  }
}

watch(shouldListen, (val) => {
  if (val) {
    listenToUser();
  } else {
    stopListening();
  }
}, { immediate: true });


// Cleanup
onBeforeUnmount(() => {
   window.removeEventListener('scroll', handleScroll);
  stopListening();
});



onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});


</script>

<template>
  <div class="bg-white w-screen min-h-screen flex flex-col relative pt-16">
    <!-- Main scrollable content -->
    <div class="flex-1 overflow-y-auto px-4 space-y-3">
      <h1 class="font-bold text-2xl mr-3">המלצות</h1>

      <div v-for="section in sections" :key="section.key">
        <div class="flex justify-between items-center">
          <h2 class="mr-4 mb-1 text-xl">{{ section.title }}</h2>
          <div class="bg-[#E6F8FA] p-1 px-2 rounded-sm text-xs text-[#48cae4]">גללו להמשך</div>
        </div>

        <div class="flex gap-4 overflow-x-auto">
          <RestaurantCard
            v-for="(restaurant, i) in recommendations[section.key]"
            :restaurantInfo="restaurant"
            :key="i"
            @click="selectRestaurant(restaurant)"
          />
        </div>
      </div>
    </div>

    <!-- Fixed bars -->
    <TopBar :scrolled="isScrolled" />
    <BottomBar/>
  </div>
</template>

<style scoped>
/* Add to global CSS or <style scoped> */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}
</style>