<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import RestaurantsContent from '../data/RestaurantsContent.json';
import BottomBar from '../components/BottomBar.vue';
import TopBar from '../components/TopBar.vue';
import { popupState } from '../stores/popup';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAppState } from '../stores/appState'; 

const state = useAppState();
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

const selectRestaurant = (restaurant) => {
  state.setRestaurant(restaurant);
}

</script>

<template>
    <div class="bg-white w-screen min-h-screen flex flex-col relative pt-16">
        <div class="flex-1 overflow-y-auto px-4 space-y-4">
            <div class="font-bold text-2xl mr-3">מסעדות</div>
            <div class="mr-4 mb-1 text-xl">כל המסעדות</div>
            <RestaurantCard
                v-for="(restaurant, index) in RestaurantsContent"
                :key="index"
                :restaurantInfo="restaurant"
                @click="selectRestaurant(restaurant)"
                />
        </div>
        <TopBar :scrolled="isScrolled"/>     
        <BottomBar/>

    </div>
</template>

<style scoped>

</style>