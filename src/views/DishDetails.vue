<script setup>
import { popupState } from '../stores/popup'
import { ref, computed } from 'vue'

const props = defineProps({
  dishInfo: Object,
  stepNumber: Number
})
const notes = ref('')
const selectedOptions = ref({})


const handleOptionChange = (prefIndex, option, isSingle) => {
  if (isSingle) {
    selectedOptions.value[prefIndex] = [option]
  } else {
    const current = selectedOptions.value[prefIndex] || []
    if (current.includes(option)) {
      selectedOptions.value[prefIndex] = current.filter(o => o !== option)
    } else {
      if (current.length < props.dishInfo.preferences[prefIndex].numberOfPick) {
        selectedOptions.value[prefIndex] = [...current, option]
      }
    }
  }
}

// חישוב תוספת מחיר אם יש
const extraPrice = computed(() => {
  let sum = 0
  props.dishInfo.preferences?.forEach((pref, index) => {
    if (pref.addedPrice && selectedOptions.value[index]) {
      sum += selectedOptions.value[index].length * pref.addedPrice
    }
  })
  return sum
})

// מחיר כולל
const totalPrice = computed(() => {
  return (props.dishInfo.price + extraPrice.value) * quantity.value
})


const quantity = ref(1)


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
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title + Price -->
        <h1 class="text-2xl font-bold mb-2">{{ dishInfo.name }}</h1>
        <span class="text-[#00BEE5] text-lg font-semibold mb-2">₪{{ dishInfo.price }}</span>
        
        <!-- Description -->
        <p class="text-gray-600 text-sm mt-2 mb-4 whitespace-pre-line">{{ dishInfo.description }}</p>
        <div class="border-t pt-4 mt-4"></div>
        <!-- Preferences -->
        <div v-if="dishInfo.preferences" class="space-y-6">
          <div v-for="(pref, index) in dishInfo.preferences" :key="index">
            <h3 class="text-base font-semibold">{{ pref.title }}</h3>
            <p v-if="pref.subtitle" class="text-sm text-gray-500 mb-2">{{ pref.subtitle }}</p>

            <!-- רדיובטנים (בחירה יחידה) -->
            <div v-if="pref.numberOfPick === 1" class="space-y-2">
              <label v-for="option in pref.options" :key="option" class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  :name="'pref_' + index"
                  :value="option"
                  :checked="selectedOptions[index]?.[0] === option"
                  @change="handleOptionChange(index, option, true)"
                />
                <span>{{ option }}</span>
              </label>
            </div>

            <!-- צ'קבוקסים (בחירה מרובה) -->
            <div v-else class="space-y-2">
              <p v-if="dishInfo.subtitle"></p>
              <label
                v-for="option in pref.options"
                :key="option"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="option"
                  :checked="selectedOptions[index]?.includes(option)"
                  @change="handleOptionChange(index, option, false)"
                  :disabled="
                    !selectedOptions[index]?.includes(option) &&
                    (selectedOptions[index]?.length || 0) >= pref.numberOfPick
                  "
                />
                <span
                  :class="{
                    'text-gray-500': !selectedOptions[index]?.includes(option) &&
                                    (selectedOptions[index]?.length || 0) >= pref.numberOfPick
                  }"
                  class="flex items-center gap-1 justify-between w-full"
                >
                  {{ option }}
                  <span v-if="pref.addedPrice" class="text-xs text-gray-400">+₪{{ pref.addedPrice }}</span>
                </span>
              </label>
            </div>
          </div>
        </div>
        <div class="mt-4 px-2 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">הערות למנה (לא חובה):</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="כתבו אם יש משהו שחשוב שנדע 😊"
            class="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#00BEE5]"
          ></textarea>
            <button
            v-if="notes"
            @click="notes = ''"
            class="absolute top-[38px] left-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t pt-4 mt-4 sticky bottom-0 bg-white">
        <div class="flex items-cente justify-between mb-4">
          <div class="flex items-center space-x-2 m-2.5">
            <button @click="decrease" class="w-8 h-8 rounded-full bg-gray-200 text-lg">−</button>
            <span class="font-medium">{{ quantity }}</span>
            <button @click="increase" class="w-8 h-8 rounded-full bg-gray-200 text-lg">+</button>
          </div>
            <button class="w-full bg-[#00BEE5] text-white py-3 rounded-xl text-lg font-semibold">
            הוספה להזמנה - ₪{{ totalPrice.toFixed(2) }}
            </button>
        </div>

        
      </div>
    </div>
  </div>
</template>
