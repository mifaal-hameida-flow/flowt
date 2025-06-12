<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import { ref } from 'vue';
import RestaurantsContent from '../data/RestaurantsContent.json';
import PopupGuideContent from '../data/PopupGuideContent.json';
import PopupGuide from '../components/PopupGuide.vue';
import BottomBar from '../components/BottomBar.vue';

const step = ref(0);
</script>

<template>
    <div class="bg-white w-screen h-screen flex-col">
        <div class="title"></div>
        <div class="subtitle"></div>
        <RestaurantCard
            v-for="(restaurant, index) in RestaurantsContent"
            :key="index"
            :restaurantName="restaurant.name"
            />
        <popupGuide
            :stepInfo="popupGuideContent[step]"
             />
        <BottomBar/>
    </div>
</template>

<style scoped>

</style>