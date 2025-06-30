<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import RestaurantsContent from '../data/RestaurantsContent.json';
import BottomBar from '../components/BottomBar.vue';
import TopBar from '../components/TopBar.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isScrolled = ref(false);


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
    <div class="bg-white w-screen min-h-screen flex flex-col relative pt-16 pb-20">
        <div class="flex-1 overflow-y-auto pb-4">
            <div class="font-bold text-2xl mr-3">כותרת</div>
            <div class="mr-4 mb-1 text-xl">תת כותרת</div>
            <RestaurantCard
                v-for="(restaurant, index) in RestaurantsContent"
                :key="index"
                :restaurantInfo="restaurant"
                />
        </div>
        <TopBar :scrolled="isScrolled"/>     
        <BottomBar/>
    </div>
</template>

<style scoped>

</style>