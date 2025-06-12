<script setup>
import { ref } from 'vue';
const props = defineProps({
  stepInfo: Object
}) 
const firstCard = props.stepInfo.cards[0];
</script>

<template>
    <div v-if="firstCard" class="flex flex-col mx-8 my-4 items-center justify-center bg-[#EBF7FD] p-6 rounded-xl shadow-lg text-center">
        <p class="mb-3">{{ firstCard.preTitle }}</p>
        <h2 class="text-xl font-bold mb-4 text-[#009DE0] font-title">{{ firstCard.title }}</h2>
        <div v-for="(paragraph, idx) in firstCard.message" :key="idx" class="mb-3">
            <p>{{ paragraph }}</p>
        </div>
    </div>
</template>

<style scoped>
</style>