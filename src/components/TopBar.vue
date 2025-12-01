<script setup>
import { ref, computed } from 'vue'
import { vTooltip } from 'floating-vue'
import { defineProps } from 'vue'
import locationIcon from '../assets/media/topbar/map-location.png'
import filterIcon from '../assets/media/topbar/filter.png'
import { useAppState } from '../stores/appState'; 
const state = useAppState();
defineProps({ scrolled: Boolean })

const topBarIcons = ref([
  { text: "מיקום", icon: locationIcon },
  { text: "פילטרים", icon: filterIcon },
])

// Tooltip visibility state for each icon
const tooltips = ref(topBarIcons.value.map(() => false))

// Show specific tooltip temporarily
function showTooltipTemporarily(index) {
  tooltips.value[index] = true
  setTimeout(() => {
    tooltips.value[index] = false
  }, 3000)
}

// Tooltip content function, just like in bottom bar
function getTooltipContent(index) {
  if (tooltips.value[index]) {
    return {
      content: 'לא זמין בשלב זה בלומדה',
      shown: true,
      triggers: [],
      placement: 'bottom',
      strategy: 'fixed'
    }
  }
  return null
}
</script>

<template>
  <div :class="[
    'flex justify-between fixed top-0 py-2 bg-white w-full z-60 transition-shadow',
    scrolled ? 'shadow-md' : ''
  ]">
    <div class="flex space-x-1 items-center">
      <div
        v-tooltip="getTooltipContent(0)"
        class="icon-bg mr-2"
        @click="showTooltipTemporarily(0)"
      >
        <img class="w-6 h-6" :src="topBarIcons[0].icon" />
      </div>
      <p>המיקום שלי</p>
    </div>
    <!-- <div
      v-tooltip="getTooltipContent(1)"
      class="icon-bg ml-2"
      @click="showTooltipTemporarily(1)"
    >
      <img class="w-6 h-6" :src="topBarIcons[1].icon" />
    </div> -->
  </div>
</template>

<style scoped>
.icon-bg {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 6px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
