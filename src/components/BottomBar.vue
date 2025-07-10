<script setup>
import { ref, onMounted } from 'vue';
import likeIcon from '../assets/media/bottombar/like.png'
import restaurantIcon from '../assets/media/bottombar/restaurant.png'
import loupeIcon from '../assets/media/bottombar/loupe.png'
import userIcon from '../assets/media/bottombar/user.png'
import { vTooltip } from 'floating-vue';
import { popupState } from '../stores/popup';
import { useAppState } from '../stores/appState'; 
const state = useAppState();

const props = defineProps({showTooltip: Boolean});

const bottomBarData = ref([
  { text: "מומלץ עבורך", src: likeIcon, active: false },
  { text: "מסעדות", src: restaurantIcon, active: true },
  { text: "חיפוש", src: loupeIcon, active: false },
  { text: "אזור אישי", src: userIcon, active: false },
])

const tooltips = ref(bottomBarData.value.map(() => false));

const showTooltipTemporarily = (index) => {
  tooltips.value[index] = true;
  setTimeout(() => {
    tooltips.value[index] = false;
  }, 3000);
};

const handleClick = (event, index) => {
  const label = event.target.innerText || event.target.alt;

  if (state.step === 3) {
    if (label === "מומלץ עבורך") {
      bottomBarData.value.forEach(i => i.active = false);
      bottomBarData.value[0].active = true;
      state.nextStep();
    } else {
      popupState.manualCard = {
        id: 'manual-1',
        title: 'אופס!',
        message: ['אי אפשר ללחוץ על זה עכשיו...🫣', 'כנראה שתצטרכו לנסות את האיטלקי קודם'],
        buttonTask: {
          msg: 'הבנתי',
          src: '././media/buttons/knowledge.png'
        }
      };
      popupState.isVisible = true;
    }
  } else {
    showTooltipTemporarily(index); // 👈 only show on click
  }
};
const getTooltipContent = (index) => {
  // 🛑 Don't show tooltip on the active icon
  if (bottomBarData.value[index].active) {
    return null;
  }

  if (state.step !== 3 && tooltips.value[index]) {
    return {
      content: 'לא זמין בשלב זה בלומדה',
      shown: true,
      triggers: [], // prevent hover/focus
      placement: 'top',
    };
  }

  if (state.step === 3 && index === 0 && props.showTooltip) {
    return {
      content: 'שמנו לב שאהבת איטלקי... 🍝',
      shown: true,
      triggers: [],
      placement: 'top',
    };
  }

  return null;
};

onMounted(() => {
  if (state.step === 4) {
    // Set all inactive
    bottomBarData.value.forEach(item => item.active = false);

    // Set only 'מומלץ עבורך' (first one) as active
    bottomBarData.value[0].active = true;
  }
});

</script>

<template>
  <div class="bg-white shadow-top flex justify-around p-4 sticky bottom-0 w-full z-50 " >
    <div v-for="(icon, index) in bottomBarData" :key="index" class="flex flex-col items-center bottom-bar-item"  v-tooltip="getTooltipContent(index)"
        @click="(event) => handleClick(event, index)"
        :class="state.step === 3 && index === 0 ? 'animate-pulse' : ''">
      <img :src="icon.src" :class="['w-8 h-8 mb-1', icon.active && 'active']" :alt=icon.text />
      <div :class="['text-[0.85rem]', icon.active && 'active']">{{ icon.text }}</div>
    </div>
  </div>
</template>

<style scoped>
.shadow-top {
  box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -2px rgba(0,0,0,0.1);
}

.active {
    filter: invert(50%) sepia(72%) saturate(600%) hue-rotate(145deg);
}

</style>
