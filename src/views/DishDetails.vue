<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import { useAppState } from '../stores/appState'; 
import { vTooltip } from 'floating-vue'
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { logEvent } from '../logger';
import { getUserId } from '../user';
import { getCurrentViewComponent } from '../viewsMap';
const state = useAppState();
const userId = getUserId();
const component = getCurrentViewComponent(state.step);
const notes = ref('')
const selectedOptions = ref({})
const finishOrderTooltipShown = ref(false)
const tooltipIsActive = ref(false)

const tooltipContent = {
  image: 'תמונה היא <strong style="color:#48cae4;">נתון לא מובנה</strong><br> המערכת לא יודעת לקרוא אותה (ללא עיבוד מיוחד), רק להציג',
  title: 'זה <strong style="color:#48cae4;">נתון מובנה</strong> – <br> נשמר בשדה קבוע ולכן אפשר לסדר,<br> לחפש ולסנן לפי שם',
  price: 'זה <strong style="color:#48cae4;">נתון מובנה</strong> – נשמר בשדה מוגדר – <br>אפשר לחשב ולסנן לפי מחיר',
  description: 'זה <strong style="color:#48cae4;">נתון לא מובנה</strong> –  טקסט חופשי, <br>לא נכנס לשדה מוגדר – אי אפשר לנתח אותו אוטומטית',
  preferences: '<strong style="color:#48cae4;">נתון מובנה</strong> - בחירה מתוך ערכים קבועים<br> (למשל "בלי גבינה", "תוספת זיתים"). <br>המערכת שומרת כל בחירה כשדה ברור.',
  notes: '<strong style="color:#48cae4;">נתון לא מובנה</strong> – טקסט שהמשתמש כותב חופשי (כמו "בלי חריף בבקשה")<br>המערכת לא יכולה להבין או לנתח את התוכן הזה לבד.',
  finishOrder: 'לחצו עליי ותראו איך ההזמנה שלכם<br> נשמרת בהיסטוריית ההזמנות!'
}

const seenTooltips = ref({
  image: false,
  title: false,
  price: false,
  description: false,
  preferences: false,
  notes: false
})

const visibleTooltips = ref({
  image: false,
  title: false,
  price: false,
  description: false,
  preferences: false,
  notes: false
})

const allTooltipsSeen = computed(() =>
  Object.values(seenTooltips.value).every(Boolean)
)

const logElementClick = (elementKey, source = "manual") => {
  logEvent({
    userId,
    action: "element_click",
    route: component.__name,
    stepNumber: state.step,
    metadata: {
      element: elementKey,
      source // "manual" או "auto"
    }
  });
};


let tour = null;

const startSingleStepTour = (key) => {
  if (tooltipIsActive.value || seenTooltips.value[key]) return;

  const element = document.querySelector(`.${key}-part`);
  if (!element) return;

  if (tour) {
    tour.cancel();
    tour = null;
  }

   logEvent({
    userId,
    action: 'auto_tour_used',
    route: component.__name,
    stepNumber: state.step,
    metadata: { highlightedElement: key }
  })

  tour = new Shepherd.Tour({
    defaultStepOptions: {
      cancelIcon: { enabled: false }, 
      classes: 'shepherd-theme-arrows',
      scrollTo: true,
      scrollToHandler: (el) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
      highlightClass: 'highlight-element',
    },
    useModalOverlay: true,
  });

  tour.addStep({
    id: key,
    text: '💡 לחצו על האזור המסומן כדי לחשוף את ההסבר',
    attachTo: {
      element,
      on: key === 'price' ? 'bottom' : 'auto',
    },
    buttons: [],
  });

  tour.on('cancel', () => {
    tooltipIsActive.value = false;
    resetIdleTimer();
  });

  tour.on('complete', () => {
    tooltipIsActive.value = false;
    resetIdleTimer();
  });

  tour.start();
  tooltipIsActive.value = true;

  const handleClick = () => {
    tour.complete();
    tour = null;

    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 3);

    showTooltipTemporarily(key);
    logElementClick(key, "auto");
    element.removeEventListener('click', handleClick);
  };

  element.addEventListener('click', handleClick);
};


const handleOptionChange = (prefIndex, option, isSingle) => {
  const current = selectedOptions.value[prefIndex] || []

  if (isSingle) {
    selectedOptions.value = {
      ...selectedOptions.value,
      [prefIndex]: [option],
    }
  } else {
    let newArray = []

    if (current.includes(option)) {
      newArray = current.filter(o => o !== option)
    } else if (current.length < state.selectedDish.preferences[prefIndex].numberOfPick) {
      newArray = [...current, option]
    } else {
      newArray = current
    }

    selectedOptions.value = {
      ...selectedOptions.value,
      [prefIndex]: newArray
    }
  }

  logEvent({
    userId,
    action: "preference_change",
    route: component.__name,
    stepNumber: state.step,
    metadata: {
      preferenceTitle: state.selectedDish.preferences[prefIndex].title,
      selectedOptions: selectedOptions.value[prefIndex]
    }
  })
}

const logNotesChange = (value) => {
  if (value.trim()) {
    logEvent({
      userId,
      action: "notes_change",
      route: component.__name,
      stepNumber: state.step,
      metadata: { notes: value }
    })
  }
}

const extraPrice = computed(() => {
  let sum = 0;
  const prefs = state.selectedDish.preferences || [];

  prefs.forEach((pref, index) => {
    const selected = selectedOptions.value[index];

    // Only apply addedPrice if it's defined and > 0
    if (pref.addedPrice && Array.isArray(selected)) {
      selected.forEach(option => {
        if (option !== 'ללא תוספות') {
          sum += pref.addedPrice;
        }
      });
    }
  });

  return sum;
});


// מחיר כולל
const totalPrice = computed(() => {
  return (state.selectedDish.price + extraPrice.value) * quantity.value
})

const quantity = ref(1)

const increase = () => quantity.value++
const decrease = () => {
  if (quantity.value > 1) quantity.value--
}

const tooltipPlacement = {
  image: 'auto',
  title: 'auto',
  price: 'auto',
  description: 'auto',
  preferences: 'auto',
  notes: 'auto'
}

const getTooltipContent = (key) => {
  if (state.step === 6 && visibleTooltips.value[key]) {
    return {
      content: tooltipContent[key],
      shown: true,
      triggers: [],
      placement: tooltipPlacement[key] || 'top',
      html: true,
    }
  }
  return null
}
const showTooltipTemporarily = (key) => {
  if (state.step !== 6 || tooltipIsActive.value) return;

  tooltipIsActive.value = true;

  // Hide all tooltips
  Object.keys(visibleTooltips.value).forEach(k => {
    visibleTooltips.value[k] = false;
  });

  visibleTooltips.value[key] = true;

  setTimeout(() => {
    seenTooltips.value[key] = true;
    visibleTooltips.value[key] = false;
    tooltipIsActive.value = false;
    resetIdleTimer(); // 👈 הוספת שורת reset פה
  }, 5000);
};

const saveData = () => {
  const order = {
    restaurantName: state.selectedRestaurant.name,
    rating: state.selectedRestaurant.rating,
    type: state.selectedRestaurant.type,
    items: [
      {
        dishName: state.selectedDish.name,
        quantity: quantity.value,
        basePrice: state.selectedDish.price,
        totalPrice: totalPrice.value,
        preferences: Object.entries(selectedOptions.value).map(([index, options]) => ({
          title: state.selectedDish.preferences[index].title,
          selected: options
        })),
        notes: notes.value
      }
      ],
      deliveryFee: state.deliveryFee,
      orderPrice: Number((totalPrice.value + state.deliveryFee).toFixed(2)),
      orderDateTime: new Date().toLocaleString('sv-SE', { hour12: false }).replace(' ', 'T')
    }
  state.currOrder.push(order)
  state.nextStep();
}
const showTooltip = () => {
  finishOrderTooltipShown.value = true;
}

const finishOrder = () => {
  // push order to orderHistory.json
  state.currOrderHistory.push(...state.currOrder)
  state.currOrder = [] // אם את רוצה לאפס את ההזמנה הפעילה
  state.nextStep();
}

const totalTooltips = ref(6);
const seenCount = computed(() =>
  Object.values(seenTooltips.value).filter(Boolean).length
)

watch(allTooltipsSeen, (val) => {
  if (val && state.step === 6) {
    setTimeout(() => {
      state.nextStep()
    }, 1500) // slight delay before advancing
  }
})

let notesTimeout = null

watch(notes, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (notesTimeout) clearTimeout(notesTimeout)
    notesTimeout = setTimeout(() => {
      logNotesChange(newVal)
    }, 2000) // ⏱️ 2 שניות אחרי שהפסיק לכתוב
  }
})

let idleTimer = null;

const resetIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);

  let timeOfWait = 4000;
  if (state.step === 6 && !allTooltipsSeen.value && !tooltipIsActive.value) {
    const unseenKeys = Object.keys(seenTooltips.value).filter(key => !seenTooltips.value[key]);
    
    if (unseenKeys.length !== 0 && !state.showPopup) {
      const hasSeenAny = Object.keys(seenTooltips.value).some(key => seenTooltips.value[key]);
      if (hasSeenAny) timeOfWait = 6500;

      idleTimer = setTimeout(() => {
        const randomKey = unseenKeys[Math.floor(Math.random() * unseenKeys.length)];
        startSingleStepTour(randomKey);
      }, timeOfWait);
    }
  }
};


const userActivityEvents = ['click'];

onMounted(() => {
  const existingOrder = state.currOrder.find(order =>
    order.dishId === state.selectedDish.id || order.dishName === state.selectedDish.name
  )

  if (existingOrder) {
    // Restore quantity
    quantity.value = existingOrder.quantity || 1

    // Restore notes
    notes.value = existingOrder.notes || ''

    // Restore preferences
    const restoredOptions = {}
    if (existingOrder && Array.isArray(existingOrder.preferences)) {
        existingOrder.preferences.forEach((pref, index) => {
        restoredOptions[index] = pref.selected;
      });
    }

    selectedOptions.value = restoredOptions
  }
  if (state.step===8) {
    showTooltip();
  }

  userActivityEvents.forEach(event =>
    window.addEventListener(event, resetIdleTimer, { passive: true })
  );

  resetIdleTimer(); // Start timer
})


onBeforeUnmount(() => {
  userActivityEvents.forEach(event =>
    window.removeEventListener(event, resetIdleTimer)
  );

  if (idleTimer) clearTimeout(idleTimer);
});

</script>

<template>
  <div class="bg-white min-h-screen flex flex-col">
    <div class="relative"
    :class="{
      'border-2 rounded-md': visibleTooltips.image,
      'border-[#00BEE5]': visibleTooltips.image && !seenTooltips.image,
      'border-gray-300 opacity-70': visibleTooltips.image && seenTooltips.image
    }"
  >
    <span
    v-if="seenTooltips.image && state.step === 6"
    class="absolute bottom-2 right-2 bg-white bg-opacity-80 text-gray-600 text-xs px-2 py-1 rounded shadow"
  >
    👁️ נצפה
  </span>
  <img
    :src="state.selectedDish.image"
    alt="Dish Image"
    class="w-full h-64 object-cover image-part"
    v-tooltip="getTooltipContent('image')"
    @click.stop="!tooltipIsActive && (showTooltipTemporarily('image'), logElementClick('image', 'manual'))"
  />
  

  <!-- Overlay Badge on top of the image -->
  <div
    v-if="state.step === 6"
    class="fixed top-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-700"
    dir="rtl"
  >
    <div class="flex justify-center items-center gap-2 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow-md">
      <span>💡 עברת על </span>
      <span class="font-semibold text-[#00BEE5]">{{ seenCount }}/{{ totalTooltips }}</span>
      <span>חלקים</span>
    </div>
  </div>
</div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title + Price -->
        <h1 class="text-2xl font-bold mb-2"
        >
          <span
        :class="{
          'border-2 rounded-md p-1': visibleTooltips.title,
          'border-[#00BEE5]': visibleTooltips.title && !seenTooltips.title,
          'border-gray-300 opacity-70': visibleTooltips.title && seenTooltips.title
        }"

            v-tooltip="getTooltipContent('title')"
           @click.stop="!tooltipIsActive && (showTooltipTemporarily('title'), logElementClick('title', 'manual'))"
            class="cursor-pointer title-part"
          >
            {{ state.selectedDish.name }}
          </span>
        </h1>
        <div v-if="seenTooltips.title && state.step === 6" class="ml-2 font-normal mb-2 text-xs text-gray-400">👁️ נצפה</div>
        <span class="text-[#00BEE5] text-lg font-semibold mb-2 cursor-pointer price-part"
          :class="{
          'border-2 rounded-md p-1': visibleTooltips.price,
          'border-[#00BEE5]': visibleTooltips.price && !seenTooltips.price,
          'border-gray-300 opacity-70': visibleTooltips.price && seenTooltips.price
        }"

          v-tooltip="getTooltipContent('price')"
         @click.stop="!tooltipIsActive && (showTooltipTemporarily('price'), logElementClick('price', 'manual'))"
        >
          ₪{{ state.selectedDish.price }}
        </span>
        <div v-if="seenTooltips.price && state.step === 6" class="ml-2 text-xs font-normal max-w-12 text-gray-400">👁️ נצפה</div>

        <!-- Description -->
        <p class="text-gray-600 text-sm mt-2 mb-4 whitespace-pre-line cursor-pointer description-part"
          :class="{
          'border-2 rounded-md p-1': visibleTooltips.description,
          'border-[#00BEE5]': visibleTooltips.description && !seenTooltips.description,
          'border-gray-300 opacity-70': visibleTooltips.description && seenTooltips.description
        }"
          v-tooltip="getTooltipContent('description')"
         @click.stop="!tooltipIsActive && (showTooltipTemporarily('description'), logElementClick('description', 'manual'))"
        >
          {{ state.selectedDish.description }}
          <div v-if="seenTooltips.description && state.step === 6" class="ml-2 text-xs text-gray-400">👁️ נצפה</div>
        </p>
        

        <div class="border-t pt-4 mt-4"></div>

        <!-- Preferences -->
        <div v-if="state.selectedDish.preferences"
         v-tooltip="getTooltipContent('preferences')"
          :class="{
            'border-2 rounded-md p-2': visibleTooltips.preferences,
            'border-[#00BEE5]': visibleTooltips.preferences && !seenTooltips.preferences,
            'border-gray-300 opacity-70': visibleTooltips.preferences && seenTooltips.preferences
          }"
          class="space-y-6 preferences-part"
        >
          
          <div v-for="(pref, index) in state.selectedDish.preferences" :key="index">
            <h3 class="text-base font-semibold">{{ pref.title }}</h3>
            <p v-if="pref.subtitle" class="text-sm text-gray-500 mb-2">{{ pref.subtitle }}</p>

            <!-- רדיובטנים (בחירה יחידה) -->
            <div v-if="pref.numberOfPick === 1" class="space-y-2">
              <label
                v-for="option in pref.options"
                :key="option"
                class="flex items-center space-x-2 cursor-pointer"
               @click.stop="!tooltipIsActive && (showTooltipTemporarily('preferences'), logElementClick('preferences', 'manual'))"

              >
                <input
                  type="radio"
                  :name="'pref_' + index"
                  class="accent-[#00BEE5]"
                  :value="option"
                  :checked="selectedOptions[index]?.[0] === option"
                  :disabled="state.step === 6 && !allTooltipsSeen"
                  @change="handleOptionChange(index, option, true)"
                />
                <span
                  class="cursor-pointer"
                >
                  {{ option }}
                </span>
              </label>
            </div>

            <!-- צ'קבוקסים (בחירה מרובה) -->
            <div v-else class="space-y-2">
              <label
                v-for="option in pref.options"
                :key="option"
                class="flex items-center space-x-2 cursor-pointer"
               @click.stop="!tooltipIsActive && (showTooltipTemporarily('preferences'), logElementClick('preferences', 'manual'))"
              >
                <input
                  type="checkbox"
                  class="accent-[#00BEE5]"
                  :value="option"
                  :checked="selectedOptions[index]?.includes(option)"
                  @change="handleOptionChange(index, option, false)"
                  :disabled="state.step === 6 && !allTooltipsSeen ||
                  (
                    !selectedOptions[index]?.includes(option) &&
                    (selectedOptions[index]?.length || 0) >= pref.numberOfPick
                  )"
                />
                <span
                  class="flex items-center gap-1 justify-between w-full cursor-pointer"
                  :class="{
                    'text-gray-500': !selectedOptions[index]?.includes(option) &&
                                    (selectedOptions[index]?.length || 0) >= pref.numberOfPick
                  }"
                >
                  {{ option }}
                  <span v-if="pref.addedPrice && option !== 'ללא תוספות'" class="text-xs text-gray-400">
                    +₪{{ pref.addedPrice }}
                  </span>

                </span>
              </label>
            </div>
          </div>
        </div>
        <span v-if="seenTooltips.preferences && state.step === 6" class="ml-2 text-xs text-gray-400">👁️ נצפה</span>

        <div class="mt-4 px-2 relative notes-part"
        :class="{
          'border-2 rounded-md p-1': visibleTooltips.notes,
          'border-[#00BEE5]': visibleTooltips.notes && !seenTooltips.notes,
          'border-gray-300 opacity-70': visibleTooltips.notes && seenTooltips.notes
        }"
          v-tooltip="getTooltipContent('notes')"
          @click.stop="!tooltipIsActive && (showTooltipTemporarily('notes'), logElementClick('notes', 'manual'))"
        >

          <label class="block text-sm font-medium text-gray-700 mb-1">הערות למנה (לא חובה):</label>
          <textarea
            @click.stop="!tooltipIsActive && (showTooltipTemporarily('notes'), logElementClick('notes', 'manual'))"
             @blur="logNotesChange(notes)" 
            v-model="notes"
            rows="2"
            placeholder="כתבו אם יש משהו שחשוב שנדע 😊"
            :readonly="state.step === 6 && !allTooltipsSeen"
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
        <span v-if="seenTooltips.notes && state.step === 6" class="ml-2 text-xs text-gray-400">👁️ נצפה</span>

      <!-- Footer -->
      <div v-if="state.step !== 8" class="border-t pt-4 mt-4 sticky bottom-0 bg-white">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2 m-2.5">
            <button @click="decrease" class="w-8 h-8 rounded-full bg-gray-200 text-lg" :disabled="state.step === 6 && !allTooltipsSeen">−</button>
            <span class="font-medium">{{ quantity }}</span>
            <button @click="increase" class="w-8 h-8 rounded-full bg-gray-200 text-lg" :disabled="state.step === 6 && !allTooltipsSeen">+</button>
          </div>
            <!-- :disabled="state.step === 6 && !allTooltipsSeen && state.cardNumber === 0" -->
         <button
            class="w-full py-3 rounded-xl text-lg font-semibold transition-colors duration-200"
            :class="{
              'bg-[#00BEE5] text-white cursor-pointer': state.step >= 7,
              'bg-gray-400 text-gray-200 cursor-not-allowed': state.step < 7
            }"
            :disabled="state.step < 7"
            @click.once="saveData"
          >
            הוספה להזמנה - ₪{{ totalPrice.toFixed(2) }}
          </button>
        </div>
      </div>
      <div class="flex w-full justify-center sticky bottom-2" v-else>
        <transition name="slide-up" @after-enter="showTooltip">
        <button
          v-if="state.step === 8 && !state.showPopup"
          class="w-[90%] bg-[#00BEE5] text-white py-3 rounded-xl text-lg font-semibold mx-auto max-w-md shadow-lg z-50 flex justify-between"
          v-tooltip="{
            content: tooltipContent['finishOrder'],
            triggers: [],     // empty triggers = manual control
            shown: finishOrderTooltipShown,
            placement: 'top',
            html: true
          }"
          @click="finishOrder"
          >
          <p class="pr-4">סיום הזמנה</p>
          <p class="pl-4">{{ (totalPrice+state.deliveryFee).toFixed(2) }}</p>
        </button>
      </transition>
      </div>
    </div>
  </div>
</template>
<style scoped>
.slide-up-enter-active {
  transition: all 0.4s ease-out;
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to {
  transform: translateY(0%);
  opacity: 1;
}

/* .highlight-element {
  box-shadow: 0 0 0 4px #00BEE5AA !important;
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}
 */

.highlight-element {
  box-shadow: 0 0 0 4px #00BEE5AA !important;
  border-radius: 10px;
  padding: 0.5rem;
}


</style>
