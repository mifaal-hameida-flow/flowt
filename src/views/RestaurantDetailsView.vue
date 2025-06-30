<script setup>
import DishCard from '../components/DishCard.vue';
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
    <div class="relative flex-col justify-center">
      <img :src="restaurantInfo.src" alt="תמונת מסעדה" class="w-full h-56 object-cover" />
      <div class="absolute bottom-4 right-4 bg-white text-[#00AEEF] rounded-xl px-4 py-1 text-sm font-medium shadow">
        לוגו המסעדה
      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="p-4 text-right">
      <h1 class="text-2xl font-bold">{{ restaurantInfo.name }}</h1>
      <p class="text-gray-600 mt-1">{{ restaurantInfo.location }}</p>

      <div class="flex flex-wrap gap-4 text-sm text-gray-700 mt-4">
        <span>⭐ {{ restaurantInfo.rating }}</span>
        <span>{{ restaurantInfo.priceRange }}</span>
        <span>{{ restaurantInfo.deliveryTime }} דקות משלוח</span>
        <span>{{ restaurantInfo.deliveryPrice }}</span>
      </div>

      <button class="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-md text-sm">
        משלוח מהיר ({{ restaurantInfo.deliveryTime }} דקות)
      </button>
    </div>

 <div class="px-4 mt-6 space-y-8">
      <!-- Loop menu keys -->
      <div v-for="(dishes, section) in restaurantInfo.menu" :key="section">
        <h2 class="text-lg font-bold mb-4">
          {{ translateSection(section) }}
        </h2>
        <div class="grid grid-cols-2 gap-4">
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

