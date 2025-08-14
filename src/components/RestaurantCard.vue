<script setup>
import { onMounted, ref } from 'vue';
import { defineProps } from 'vue';
import { Truck, Star } from 'lucide-vue-next'; 
import { useAppState } from '../stores/appState'; 
import { vTooltip } from 'floating-vue'

const state = useAppState();

const props = defineProps({
  restaurantInfo: Object
});

const showAutoTooltip = ref(false);

const repeatTooltip = () => {
  showAutoTooltip.value = false
  setTimeout(() => {
    showAutoTooltip.value = true
  }, 1200) // Delay can be adjusted
}

onMounted(() => {
  if (props.restaurantInfo.showTooltip) {
    setTimeout(() => {
      showAutoTooltip.value = true;
    }, 300); 
  }
});

// הערות לעצמי -
// להבין למה הטולטיפ הרגיל לא מופיע בשלב 11??
</script>

<template>
  <div class="flex justify-center w-full restaurant-card" dir="rtl">
    <!-- && !state.showPopup -->
    <div
    v-tooltip="restaurantInfo.showTooltip && state.step !== 4 ? {
    content: 'לפי הנתונים שנאספו עליך נראה<br> שתאהב מאוד את המסעדה הזאת!',
    shown: showAutoTooltip,
    html: true
    } : null"
      :class="[
    'bg-white rounded-2xl shadow-md w-80 m-4 overflow-hidden hover:shadow-lg transition-shadow duration-200',
    restaurantInfo.showTooltip ? 'recommended-card' : ''
  ]"
  @click="restaurantInfo.showTooltip && repeatTooltip()"
    >
      <!-- תמונה -->
      <div class="h-40 w-full overflow-hidden relative">
        <img
          :src="restaurantInfo.src"
          alt="תמונת מסעדה"
          class="object-cover w-full h-full"
        />
        <div
          v-if="restaurantInfo.showTooltip"
         class="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full shadow-md font-bold z-10 glow"
        >
        מומלץ עבורך
      </div>
      </div>
      <!-- תוכן -->
      <div class="p-4 space-y-2">
        <!-- שורה עליונה -->
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800 truncate">
            {{ restaurantInfo.name }}
          </h2>
          
          <div class="bg-[#E6F8FA] text-[#48cae4] text-xs px-2 py-1 flex rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-1 text-[#48cae4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ restaurantInfo.deliveryTime }} דקות
          </div>
        </div>

        <!-- שורה שנייה -->
        <div class="flex justify-between items-center text-sm text-gray-600">
          <!-- מחיר משלוח -->
          <div class="flex items-center space-x-1 space-x-reverse">
            <Truck class="w-4 h-4 text-gray-500 -scale-x-100 pr-1" />
            <span>{{ restaurantInfo.deliveryPrice }}</span>
          </div>

          <!-- טווח מחירים -->
          <div>{{ restaurantInfo.priceRange }}</div>
          <!-- סוג מסעדה -->
          <div>{{ restaurantInfo.type }}</div>
          <!-- דירוג -->
          <div class="flex items-center space-x-1 space-x-reverse">
            <Star class="w-4 h-4 text-yellow-400 fill-yellow-400 pl-1" />
            <span>{{ restaurantInfo.rating }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes glow {
  0% { box-shadow: 0 0 0px rgba(255, 204, 0, 0.8); }
  50% { box-shadow: 0 0 12px rgba(255, 204, 0, 0.8); }
  100% { box-shadow: 0 0 0px rgba(255, 204, 0, 0.8); }
}

.glow {
  animation: glow 1.5s ease-in-out infinite;
}


</style>
