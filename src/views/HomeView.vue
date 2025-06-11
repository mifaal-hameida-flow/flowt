<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import { ref } from 'vue';
import RestaurantsContent from '../data/RestaurantsContent.json';
import BottomBar from '../components/BottomBar.vue';
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
        <BottomBar/>
    </div>
</template>

<style scoped>

</style>