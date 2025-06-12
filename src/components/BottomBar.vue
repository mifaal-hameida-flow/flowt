<script setup>
import { ref } from 'vue'

const bottomBarData = ref([
  { text: "מומלץ עבורך", src: "src/assets/media/bottombar/like.png", active: false },
  { text: "מסעדות", src: "src/assets/media/bottombar/restaurant.png", active: true },
  { text: "חיפוש", src: "src/assets/media/bottombar/loupe.png", active: false },
  { text: "אזור אישי", src: "src/assets/media/bottombar/user.png", active: false },
])
</script>
<!-- src\assets\media\bottombar\restaurant.png -->

<template>
  <div class="bg-white shadow-top flex justify-around p-4 fixed bottom-0 w-full z-50">
    <div v-for="(icon, index) in bottomBarData" :key="index" class="flex flex-col items-center">
      <img :src="icon.src" :class="['w-8 h-8 mb-1', icon.active && 'active']" />
      <div :class="['text-[0.85rem]', icon.active && 'active']">{{ icon.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.shadow-top {
  box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -2px rgba(0,0,0,0.1);
}

.active {
    filter: invert(50%) sepia(72%) saturate(600%) hue-rotate(140deg);
}

</style>
