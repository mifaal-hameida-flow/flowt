<script setup>
import { ref, onMounted } from 'vue';

// Props
const props = defineProps({
  stepInfo: Object
});
const firstCard = props.stepInfo.cards[0];

// State
const userName = ref('');
const isValid = ref(false);
const showGreeting = ref(false);
// Regex: Only Hebrew, English letters, spaces (optional)
const nameRegex = /^[A-Za-zא-ת\s]+$/;

const isDev = import.meta.env.DEV;
// Load saved name
onMounted(() => {
  if (isDev) {
    localStorage.removeItem('userName'); // dev-only clear
  }

  const savedName = localStorage.getItem('userName');
  if (savedName) {
    userName.value = savedName;
    showGreeting.value = true;
  }
});

// Validate input
const validateName = (name) => {
  return name.trim().length >= 2 && nameRegex.test(name.trim());
};

// Handle typing
const handleInput = (event) => {
  userName.value = event.currentTarget.value;
  isValid.value = validateName(userName.value);
};

const confirmName = () => {
  if (isValid.value) {
    localStorage.setItem('userName', userName.value.trim());
    showGreeting.value = true;
  }
};


// Clear input
const clearInput = () => {
  userName.value = '';
  isValid.value = false;
  showGreeting.value = false;
  localStorage.removeItem('userName');
};
</script>
<template>
    <!-- Always visible in dev -->
  <div v-if="isDev" class="absolute z-52 w-screen top-0 flex justify-center mt-4">
    <button
        @click="clearInput"
        class="text-xs text-gray-500 underline"
    >
        איפוס שם (dev)
    </button>
  </div>
  <div v-if="firstCard" class="fixed top-0 right-0 z-51 bg-black/[.75] w-screen h-screen flex justify-center items-center">
    <div class="flex flex-col mx-8 my-4 items-center justify-center bg-[#EBF7FD] p-6 rounded-xl shadow-lg text-center">
      
      <p v-if="firstCard.preTitle" class="mb-3">{{ firstCard.preTitle }}</p>
      <h2 v-if="firstCard.title" class="text-xl font-bold mb-4 text-[#009DE0] font-title">{{ firstCard.title }}</h2>

      <div v-for="(paragraph, idx) in firstCard.message" :key="idx" class="mb-3">
        <p>{{ paragraph }}</p>
      </div>

      <!-- Greeting instead of input -->
      <div v-if="showGreeting" class="text-green-700 font-bold mt-2">
        בתיאבון, {{ userName }}!
      </div>

      <!-- Input Field -->
      <div v-else-if="!showGreeting" class="relative w-full max-w-xs">
        <input
          class="bg-white p-1 pl-2 pr-6 w-full text-sm rounded-sm border"
          :class="{
            'border-green-500': isValid,
            'border-red-500': userName && !isValid
          }"
          v-if="firstCard.input"
          v-model="userName"
          placeholder="הכניסו את שמכם..."
          @input="handleInput"
        />
        <!-- Confirmation Button -->
        <button
        v-if="isValid && !showGreeting"
        @click="confirmName"
        class="mt-2 bg-[#009DE0] text-white px-4 py-1 rounded text-sm"
        >
        אישור
        </button>

        <!-- X Clear Button -->
        <button
          v-if="userName"
          @click="clearInput"
          class="absolute right-1 top-1 text-gray-500 hover:text-red-500 text-sm"
        >
          ✕
        </button>

        <!-- Validation Message -->
        <div class="mt-1 flex items-center justify-center space-x-2 text-sm" v-if="userName">
          <span v-if="isValid" class="text-green-600">✔️ שם תקין</span>
          <span v-else class="text-red-600">❌ שם לא תקין</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

input:focus {
  border: 1px solid #009DE0;
  outline: none;
}
</style>