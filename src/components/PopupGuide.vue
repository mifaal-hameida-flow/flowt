<script setup>
import { ref, onMounted, computed} from 'vue';

// Props
const props = defineProps({
  stepInfo: Object,
  initialCard: Number
});
const cardNumber = ref(props.initialCard || 0);
const emit = defineEmits(['next-step', 'card-number']);
const firstCard = computed(() => props.stepInfo?.cards?.[cardNumber.value]);


// State
const userName = ref('');
const isValid = ref(false);
const showGreeting = ref(false);
// Regex: Only Hebrew, English letters, spaces (optional)
const nameRegex = /^[A-Za-zא-ת\s]+$/;

const isDev = import.meta.env.DEV;
// Load saved name
onMounted(() => {
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

const nextStep = () => {
    emit('next-step');
};

const handleCard = (event) => {
 if (event.currentTarget.alt.includes("next")) {
    cardNumber.value++;
 } else {
    cardNumber.value--;
 }
 emit('card-number', cardNumber.value);
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
  <div v-if="firstCard" class="fixed top-0 right-0 z-51 bg-black/[.75] w-screen h-screen flex justify-center items-center"  
  :key="`${stepInfo.step}-${cardNumber}`"
  :class="{ 'fade-enter': firstCard.id === 1 }">
    <div class="flex flex-col mx-8 my-4 items-center justify-center bg-[#EBF7FD] p-4 rounded-xl shadow-lg text-center"
    :key="`${stepInfo.step}-${cardNumber}`" 
    :class="{ 'animate-zoom': firstCard.id === 1 }">
      
      <p v-if="firstCard.preTitle" class="mb-3">{{ firstCard.preTitle }}</p>
      <h2 v-if="firstCard.title" class="text-xl font-bold mb-4 text-[#009DE0] font-title">{{ firstCard.title }}</h2>

      <div v-for="(paragraph, idx) in firstCard.message" :key="idx" class="mb-3">
        <p>{{ paragraph }}</p>
      </div>

      <!-- only relevant for the first step -->
       <div v-if="stepInfo.step === 0" class="w-full flex flex-col items-center">
                <!-- Button with text and image -->
            <div v-if="firstCard.buttonTask && showGreeting"
                class="px-4 py-2 bg-white flex items-center justify-between rounded-lg shadow-sm mt-2"
                @click="nextStep"
                >
                    <p class="text-s text-[#009DE0]">{{ firstCard.buttonTask.msg }}</p>
                    <img :src="firstCard.buttonTask.src" alt="task image" class="mr-2 h-8 w-8 object-contain" />
            </div>
                <!-- Greeting -->
            <div v-if="showGreeting"
            class="text-black font-bold mt-2 self-start text-left w-full max-w-xs">
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
        <!-- buttons container -->
        <div class="w-full flex justify-between items-center">
            <div class="w-full flex justify-end" v-if="firstCard.buttonNext">
                <img @click="handleCard" class="mr-2 h-10 w-10 object-contain" src="/media/buttons/next-arrow.png" alt="next button"/>
            </div>

            <div class="w-full flex justify-start" v-if="firstCard.buttonBack">
                <img @click="handleCard" class="mr-2 h-10 w-10 object-contain" src="/media/buttons/back-arrow.png" alt="back button"/>
            </div>

            <div class="w-full flex justify-end" v-if="firstCard.buttonTask && stepInfo.step !== 0">
                <span @click="nextStep" class="px-2 py-1 bg-white flex items-center justify-between rounded-lg shadow-sm mt-2">
                    <p class="text-sm text-[#009DE0]">{{ firstCard.buttonTask.msg }}</p>
                    <img :src="firstCard.buttonTask.src" alt="task image" class="mr-1 h-6 w-6 object-contain" />
                </span>
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

.fade-enter {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Zoom-in animation for the card */
@keyframes zoomIn {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-zoom {
  animation: zoomIn 0.4s ease-out;
}
</style>