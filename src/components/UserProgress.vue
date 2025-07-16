<script setup>
import CircleProgress from 'vue3-circle-progress'
import ConceptsData from '../data/ConceptsData.json'
import { useAppState } from '../stores/appState'; 
import { popupState } from '../stores/popup'
import { ref, computed } from 'vue';
const state = useAppState();
const totalSteps = ref(20); // סתם המצאתי

const showTopics = ref(false);
const conceptsArray = ConceptsData;

const progressPercent = computed(() =>
  Math.min(100, Math.round((state.step / totalSteps.value) * 100))
)

const toggle = () => {
    showTopics.value = !showTopics.value;
}

const showManualPopup = (index) => {
    console.log("hi")    
     popupState.manualCard = {
        id: `manual-concept${index}`,
        title: conceptsArray[index].topic,
        message: conceptsArray[index].text,
        buttonTask: {
          msg: 'הבנתי, אפשר לחזור ללומדה',
          src: '././media/buttons/knowledge.png'
        }
      };
      popupState.isVisible = true;
 }

</script>
<template>
  <div class="fixed top-4 left-4 z-50">
    <div class="relative inline-block transition-all duration-500 ease-in-out"
         :style="{ marginLeft: showTopics ? '150px' : '0px' }">

      <!-- עיגול התקדמות -->
      <div class="relative w-[60px] h-[60px] z-55" @click="toggle">
        <CircleProgress
          :percent="progressPercent"
          :size="60"
          :stroke-width="10"
          :fill-color="'#48cae4'"
          :background="'white'"
          :show-percent="true"
          animation
        />
      </div>

      <!-- סרגל נושאים מעוצב -->
      <transition name="slide-horizontal">
        <div
          v-if="showTopics"
          class="fixed top-0 left-0 h-fit w-58 bg-white shadow-xl p-5 z-40 overflow-auto border-r border-gray-200 rounded-tr-xl rounded-br-xl"
        >
          <h3 class="text-lg pl-2 text-center font-bold my-2 mr-8 border-b pb-2 text-gray-700">סיכום מושגים</h3>
          <ul class="mt-4 space-y-3">
            <li
              v-for="(concept, index) in conceptsArray"
              :key="index"
              class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200"
              :class="state.step > concept.afterStep
                ? 'bg-green-50 hover:bg-green-100 text-green-700 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
              @click="state.step > concept.afterStep && showManualPopup(index)"
            >
              <div
                class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                :class="state.step > concept.afterStep ? 'bg-green-400 text-white' : 'bg-gray-300 text-white'"
              >
                {{ state.step > concept.afterStep ? '✔' : '?' }}
              </div>
              <span class="text-sm font-medium truncate">{{ concept.topic }}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.available {
  cursor: pointer;
  font-weight: bold;
  color: #16a34a; /* Tailwind's green-600 */
}
.slide-horizontal-enter-active,
.slide-horizontal-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-horizontal-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-horizontal-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-horizontal-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-horizontal-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

</style>