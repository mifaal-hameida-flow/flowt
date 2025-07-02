<script setup>
import { vTooltip } from 'floating-vue';
import { popupState } from '../stores/popup';
defineProps({ scrolled: Boolean});
</script>
 
<template>
    <div  :class="[
      'flex justify-between fixed top-0 py-2 bg-white w-full z-50 transition-shadow',
      scrolled ? 'shadow-md' : ''
    ]">
        <div class="flex space-x-1 items-center">
            <div class="icon-bg mr-2" v-tooltip="{ content: 'לא זמין בשלב זה של הלומדה', triggers: ['click'], delay: { show: 0, hide: 3000 } }">
                <img class="w-6 h-6" src="../assets/media/topbar/map-location.png" />
            </div>
            <p>המיקום שלי</p>
        </div>
        <div class="icon-bg ml-2" v-tooltip="{ content: 'לא זמין בשלב זה של הלומדה', triggers: ['click'], delay: { show: 0, hide: 3000 } }">
            <img class="w-6 h-6" src="../assets/media/topbar/filter.png"/>
        </div>
    </div>
</template>

<style scoped>

.icon-bg {
  background-color: rgba(0, 0, 0, 0.05); /* light gray background */
  padding: 6px;
  border-radius: 9999px; /* fully rounded */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>