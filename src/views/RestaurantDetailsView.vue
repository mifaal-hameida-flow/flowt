<script setup>
import DishCard from '../components/DishCard.vue';
import { Truck, Star } from 'lucide-vue-next'; 
const props = defineProps({
  restaurantInfo: Object
});

const translateSection = (section) => {
  const map = {
    firstCourses: "מנות ראשונות",
    mainCourses: "מנות עיקריות",
    desserts: "קינוחים"
  };
  return map[section] || section;
}

</script>
<template>
  <div class="min-h-screen bg-white">
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
        :src="restaurantInfo.src"
        alt="Header"
        class="w-full h-full object-cover"
        style="clip-path: url(#inward-arc);"
        />
      <div class="absolute bottom-[-0.75rem] flex w-full justify-center">
        <img class="w-26 h-26 rounded-xl shadow" :src="restaurantInfo.logo" alt="logo">
      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="p-4 text-center">
      <h1 class="text-2xl font-extrabold mt-2">{{ restaurantInfo.name }} | {{ restaurantInfo.location }}</h1>

      <div class="flex justify-center flex-wrap gap-1.5 text-sm text-gray-700 mt-4">
        <span>⭐ {{ restaurantInfo.rating }}</span>
        <span class="mx-1 text-gray-400">•</span>
        <span>{{ restaurantInfo.priceRange }}</span>
        <span class="mx-1 text-gray-400">•</span>
        <span>{{ restaurantInfo.deliveryTime }} דקות משלוח</span>
        <span class="mx-1 text-gray-400">•</span>
        <span class="flex items-center">
          <Truck class="w-4 h-4 text-gray-600 -scale-x-100 pr-1" />
          {{ restaurantInfo.deliveryPrice }} 
          </span>
      </div>
      <div class="w-full flex justify-center">
         <button class="flex items-center align-center text-center mt-2 bg-[#EBF7FD] text-[#009DE0] px-4 py-2 rounded-md text-sm">
         <Truck class="w-4 h-4 text-[#009DE0] -scale-x-100 pr-1" />
        משלוח משוער {{ restaurantInfo.deliveryTime }} דקות
      </button>
      </div>
    </div>

 <div class="px-4 mt-4 space-y-8">
      <!-- Loop menu keys -->
      <div v-for="(dishes, section) in restaurantInfo.menu" :key="section">
        <h2 class="text-lg font-bold mb-4">
          {{ translateSection(section) }}
        </h2>
        <div class="grid gap-2">
          <DishCard
            v-for="(dish, index) in dishes"
            :key="index"
            :dish="dish"
          />
        </div>
      </div>
    </div>

  </div>
</template>

