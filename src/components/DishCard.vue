<template>
  <div
    class="flex items-center bg-white rounded-xl overflow-hidden shadow-md transition duration-300 w-full"
    dir="rtl"
  >
    <!-- טקסט -->
    <div class="flex flex-col justify-between p-4 flex-grow text-right">
      <div>
        <h3 class="text-base font-semibold text-gray-900 leading-tight">
          {{ dish.name }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">
          {{ dish.description }}
        </p>
      </div>
      <p class="text-sm text-[#009DE0] mt-2">
        ₪{{ dish.price }}
      </p>
    </div>

    <div class="h-full flex items-center justify-center h-full p-2">
          <!-- תמונה -->
      <img
        :src="dish.image"
        :alt="dish.name"
        class="w-26 h-26 object-cover rounded-xl flex-shrink-0 align-center"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  dish: {
    type: Object,
    required: true
  }
});
</script>
