<script setup>
import { ref } from 'vue';
const props = defineProps({
  stepInfo: Object
}) 
const firstCard = props.stepInfo.cards[0];

const handleInput = (event) => {
    console.log(event.currentTarget.value)
}
</script>

<template>
    <div v-if="firstCard" class="absolute top-0 right-0 z-51 bg-black/[.75] w-screen h-screen flex justify-center items-center">
        <div class="flex flex-col mx-8 my-4 items-center justify-center bg-[#EBF7FD] p-6 rounded-xl shadow-lg text-center">
            <p v-if="firstCard.preTitle" class="mb-3">{{ firstCard.preTitle }}</p>
            <h2 v-if="firstCard.title" class="text-xl font-bold mb-4 text-[#009DE0] font-title">{{ firstCard.title }}</h2>
            <div v-for="(paragraph, idx) in firstCard.message" :key="idx" class="mb-3">
                <p>{{ paragraph }}</p>
            </div>
            <input class="bg-white p-1 text-sm rounded-sm" v-if="firstCard.input" placeholder="הכניסו את שמכם..."  @input="handleInput"/>
        </div>
    </div>
</template>

<style scoped>

input:focus {
  border: 1px solid #009DE0;
  outline: none;
}
</style>