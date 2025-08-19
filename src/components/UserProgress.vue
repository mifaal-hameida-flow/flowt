<script setup>
import CircleProgress from 'vue3-circle-progress'
import ConceptsData from '../data/ConceptsData.json'
import { useAppState } from '../stores/appState'; 
import { popupState } from '../stores/popup'
import PopupGuideContent from '../data/PopupGuideContent.json';
import { ref, computed, watch, nextTick } from 'vue';
import { logEvent } from '../logger'
import { getUserId } from '../user'
import { getCurrentViewComponent } from '../viewsMap'

const state = useAppState();
const justUnlocked = ref(false);
const userId = getUserId()
const component = getCurrentViewComponent(state.step)
const animated = ref(0);
// const totalSteps = ref(20); 
function totalCards(PopupGuideContent) {
  return PopupGuideContent.reduce((total, step) => {
    return total + (step.cards?.length || 0);
  }, 0);
}

const currentCardGlobalIndex = computed(() => {
  let index = 0;
  for (let i = 0; i < state.step; i++) {
    index += PopupGuideContent[i]?.cards?.length || 0;
  }
  return index + state.cardNumber;
});

const totalCardsCount = totalCards(PopupGuideContent);

const progressPercent = computed(() =>
  Math.min(100, Math.round((currentCardGlobalIndex.value + 1) / totalCardsCount * 100))
);


const conceptsArray = ConceptsData;

const toggle = () => {
  logEvent({
    userId,
    action: 'toggle_progBar',
    route: component.__name,
    stepNumber: state.step,
    metadata: { from: state.progressBarOpen, to: !state.progressBarOpen, isAuto: false }
  })
   state.toggleProgress();
}

const showManualPopup = async (index) => {
  await nextTick(); // wait for DOM update
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
      logEvent({
        userId,
        action: 'opened_sumCard',
        route: component.__name,
        stepNumber: state.step,
        metadata: { concept: conceptsArray[index].topic}
      })
  }

 watch(progressPercent, (newVal) => {
  const start = animated.value;
  const end = newVal;
  const duration = 500;
  const startTime = performance.now();

  const animate = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    animated.value = Math.round(start + (end - start) * progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}, { immediate: true }); // <== this is key to make `animated` valid on first render

watch(
  () => state.step,
  (newStep) => {
    const unlocked = conceptsArray.some(concept => concept.afterStep === newStep);
    if (unlocked) {
      justUnlocked.value = true;
      // console.log('Step advanced & concept unlocked at step', newStep);
    }
  }
);

watch(
  () => state.showPopup,
  (popupOpen) => {
    if (!popupOpen && justUnlocked.value) {
      // console.log('Popup closed after concept unlock — opening progress bar');
      if (!state.progressBarOpen) {
         logEvent({
          userId,
          action: 'toggle_progBar',
          route: component.__name,
          stepNumber: state.step,
          metadata: { isAuto: true }
        })
        state.toggleProgress();
      }
      justUnlocked.value = false; // reset the flag
    }
  }
);


</script>
<template>
  <div class="fixed top-4 left-4 z-64">
    <div class="relative inline-block transition-all duration-500 ease-in-out"
         :style="{ marginLeft: state.progressBarOpen ? '150px' : '0px' }">

      <!-- עיגול התקדמות -->
      <div class="relative w-[60px] h-[60px] z-65" @click="toggle">
       <circle-progress
        :percent="progressPercent"
        :size="60"
        :border-width="10"
        fill-color="#48cae4"
        background="white"
        :show-percent="false"
        :transition="300"
        @progress="val => animated = val"
      />
    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%);
                font-size:12px;">
      {{ Math.round(animated) }}%
    </div>
      </div>


      <!-- סרגל נושאים מעוצב -->
      <transition name="slide-horizontal">
        <div
          v-if="state.progressBarOpen"
          class="fixed top-0 left-0 h-fit w-58 bg-white shadow-xl p-5 z-60 overflow-auto border-r border-gray-200 rounded-tr-xl rounded-br-xl"
        >
          <h3 class="text-lg pl-2 text-center font-bold my-2 mr-8 border-b pb-2 text-gray-700">סיכום מושגים</h3>
          <ul class="mt-4 space-y-3">
            <li
              v-for="(concept, index) in conceptsArray"
              :key="index"
              class="flex items-center gap-3 p-2 rounded-lg transition-all duration-200"
             :class="{
              'bg-green-50 hover:bg-green-100 text-green-700 cursor-pointer':
                (state.step === concept.afterStep && !state.showPopup) ||
                (state.step > concept.afterStep),
              'bg-gray-100 text-gray-400 cursor-not-allowed': state.step < concept.afterStep
            }"
            @click="() => {
              if (
                !state.showPopup && (
                  (state.step === concept.afterStep) ||
                  (state.step > concept.afterStep)
                )
              ) {
                showManualPopup(index);
              }
            }">
              <div
                class="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                :class="(state.step > concept.afterStep || (state.step === concept.afterStep && !state.showPopup))
                ? 'bg-green-400 text-white'
                : 'bg-gray-300 text-white'"
                >
                 {{
                    (state.step > concept.afterStep || (state.step === concept.afterStep && !state.showPopup))
                      ? '✔'
                      : '?'
                  }}
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