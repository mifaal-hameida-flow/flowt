<template>
  <div class="relative bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="absolute top-2 right-2 bg-blue-100 rounded-full p-1">
      <span class="text-blue-600 text-xl font-bold">+</span>
    </div>
    <img  alt="תמונה של המנה" class="w-full h-32 object-cover" />
    <div class="p-2 text-right">
      <p class="text-blue-600 font-bold">₪{{ dish.price }}</p>
      <p class="text-sm font-medium text-gray-800">{{ dish.name }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  dish: Object
});
</script>
