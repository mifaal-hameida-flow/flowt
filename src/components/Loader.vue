<script setup>
import { popupState } from '../stores/popup';
</script>
<template>
  <div class="absolute top-0 right-0 z-52 w-screen h-screen bg-[#00BEE5] flex flex-col items-center justify-start pt-8">
    <!-- Your image -->
    <img src="../assets/media/loader/flowt2.jpeg" class="w-full max-w-xs mb-6" />

    <!-- Spinner + Text -->
    <div class="flex flex-col items-center text-white">
      <svg class="mt-4 w-8 h-8 animate-spin mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z">
        </path>
      </svg>
      <p class="text-lg font-semibold">בטעינה...</p>
    </div>
  </div>
</template>


<style scoped>
</style>