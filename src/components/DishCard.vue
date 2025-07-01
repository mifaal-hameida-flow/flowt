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
        <p class="text-sm text-gray-500 mt-1 line-clamp-2 break-words overflow-hidden text-ellipsis">
          {{ dish.description }}
        </p>
      </div>
      <p class="text-sm text-[#009DE0] mt-2">
        ₪{{ dish.price }}
      </p>
    </div>

    <div class="flex items-center justify-center h-full p-2">
          <!-- תמונה -->
      <img
        :src="dish.image"
        :alt="dish.name"
        class="w-28 h-28 object-cover rounded-xl flex-shrink-0 align-center"
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
