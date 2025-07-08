<script setup>
import { popupState } from '../stores/popup'
import { ref, computed } from 'vue'

const props = defineProps({
  dishInfo: Object
})

const quantity = ref(1)

const totalPrice = computed(() => props.dishInfo.price * quantity.value)

const increase = () => quantity.value++
const decrease = () => {
  if (quantity.value > 1) quantity.value--
}
</script>

<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- Image -->
    <div class="relative">
      <img :src="dishInfo.image" alt="Dish Image" class="w-full h-64 object-cover" />
      <button class="absolute top-4 left-4 bg-white p-2 rounded-full shadow">✕</button>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title + Price -->
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-xl font-bold">{{ dishInfo.name }}</h1>
          <span class="text-blue-500 text-lg font-semibold">₪{{ dishInfo.price }}</span>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-sm mb-4 whitespace-pre-line">{{ dishInfo.description }}</p>
      </div>

      <!-- Footer -->
      <div class="border-t pt-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <button @click="decrease" class="w-8 h-8 rounded-full bg-gray-200 text-lg">−</button>
            <span class="font-medium">{{ quantity }}</span>
            <button @click="increase" class="w-8 h-8 rounded-full bg-gray-200 text-lg">+</button>
          </div>
        </div>

        <button class="w-full bg-blue-500 text-white py-3 rounded-xl text-lg font-semibold">
          הוספה להזמנה - ₪{{ totalPrice.toFixed(2) }}
        </button>
      </div>
    </div>
  </div>
</template>
