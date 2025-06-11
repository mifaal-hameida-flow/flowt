<script setup>
const props = defineProps({
  restaurantName: String
})
</script>

<template>
    <div class="flex w-screen justify-center">
        <div class="bg-white rounded-xl shadow-lg text-center w-64 h-18 m-2 text-black flex items-center justify-center text-lg">
            {{ restaurantName }}
        </div>
    </div>
</template>

<style scoped>
</style>