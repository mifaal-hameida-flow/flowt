<script setup>
import { defineProps } from 'vue';
import { Truck, Star } from 'lucide-vue-next'; 
const props = defineProps({
  restaurantInfo: Object
});
</script>

<template>
  <div class="flex justify-center w-full" dir="rtl">
    <div
      class="bg-white rounded-2xl shadow-md w-80 m-4 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <!-- תמונה -->
      <div class="h-40 w-full overflow-hidden">
        <img
          :src="restaurantInfo.src"
          alt="תמונת מסעדה"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- תוכן -->
      <div class="p-4 space-y-2">
        <!-- שורה עליונה -->
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-800 truncate">
            {{ restaurantInfo.name }}
          </h2>
          <div class="bg-gray-100 text-[#009DE0] text-xs px-2 py-1 flex rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-1 text-[#009DE0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
</style>
