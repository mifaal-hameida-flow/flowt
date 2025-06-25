<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import { ref } from 'vue';
import RestaurantsContent from '../data/RestaurantsContent.json';
import PopupGuideContent from '../data/PopupGuideContent.json';
import PopupGuide from '../components/PopupGuide.vue';
import BottomBar from '../components/BottomBar.vue';
import TopBar from '../components/TopBar.vue';

const step = ref(0);
</script>

<template>
    <div class="bg-white w-screen h-screen flex-col">
        <div class="pt-16 flex-1">
            <div class="mr-2">כותרת</div>
            <div class="mr-3">תת כותרת</div>
            <RestaurantCard
                v-for="(restaurant, index) in RestaurantsContent"
                :key="index"
                :restaurantName="restaurant.name"
                />
        </div>
       
        <popupGuide
            :stepInfo="PopupGuideContent[step]"
             />
        <TopBar/>     
        <BottomBar/>
    </div>
</template>

<style scoped>

</style>