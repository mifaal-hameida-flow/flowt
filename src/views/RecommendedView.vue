<script setup>
import RestaurantCard from '../components/RestaurantCard.vue'
import recommendations from '../data/Recommended.json'
import TopBar from '../components/TopBar.vue'
import BottomBar from '../components/BottomBar.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  stepNumber: Number
});

const isScrolled = ref(false);

const sections = [
  { title: 'הזמנה חוזרת', key: 'recent' },
  { title: 'מומלץ עבורך', key: 'recommended' },
  { title: 'פופולרי עכשיו', key: 'popular' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
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
          <div class="bg-blue-100 p-1 rounded-sm text-sm text-[#009DE0] font-bold">גללו להמשך</div>
        </div>

        <div class="flex gap-4 overflow-x-auto">
          <RestaurantCard
            v-for="(restaurant, i) in recommendations[section.key]"
            :key="i"
            :restaurantInfo="restaurant"
          />
        </div>
      </div>
    </div>

    <!-- Fixed bars -->
    <TopBar :scrolled="isScrolled" />
    <BottomBar :step="stepNumber" />
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