<script setup>
import { ref, computed, watch, onMounted} from 'vue'
import { useAppState } from '../stores/appState'; 
import orderHistory from '../data/orderHistory.json'
import { vTooltip } from 'floating-vue'

const state = useAppState();

const notes = ref('')
const selectedOptions = ref({})
const finishOrderTooltipShown = ref(false)

const tooltipContent = {
  image: 'תמונה היא <strong style="color:#48cae4;">נתון לא מובנה</strong><br> המערכת לא יודעת לקרוא אותה (ללא עיבוד מיוחד), רק להציג',
  title: 'זה <strong style="color:#48cae4;">נתון מובנה</strong> – <br> נשמר בשדה קבוע ולכן אפשר לסדר,<br> לחפש ולסנן לפי שם',
  price: 'זה <strong style="color:#48cae4;">נתון מובנה</strong> – נשמר בשדה מוגדר – <br>אפשר לחשב ולסנן לפי מחיר',
  description: 'זה <strong style="color:#48cae4;">נתון לא מובנה</strong> –  טקסט חופשי, <br>לא נכנס לשדה מוגדר – אי אפשר לנתח אותו אוטומטית',
  preferences: '<strong style="color:#48cae4;">נתון מובנה</strong> - בחירה מתוך ערכים קבועים<br> (למשל "בלי גבינה", "תוספת זיתים"). <br>המערכת שומרת כל בחירה כשדה ברור.',
  notes: '<strong style="color:#48cae4;">נתון לא מובנה</strong> – טקסט שהמשתמש כותב חופשי (כמו "בלי חריף בבקשה")<br>.המערכת לא יכולה להבין או לנתח את התוכן הזה לבד.',
  finishOrder: 'לחצו עליי ותראו איך ההזמנה שלכם נשמרת בהיסטוריית ההזמנות!'
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
  image: 'bottom',
  title: 'bottom',
  price: 'left',
  description: 'top',
  preferences: 'auto-start',
  notes: 'top'
}

const getTooltipContent = (key) => {
  if (state.step === 6 && visibleTooltips.value[key] && !seenTooltips.value[key]) {
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
  if (state.step !== 6 || seenTooltips.value[key]) return;

  visibleTooltips.value[key] = true;

  setTimeout(() => {
    visibleTooltips.value[key] = false;
    seenTooltips.value[key] = true;
  }, 3500);
};

const saveData = () => {
  const order = {
    restaurantName: state.selectedRestaurant.name,
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
  state.orderHistory.push(...state.currOrder)
  state.currOrder = [] // אם את רוצה לאפס את ההזמנה הפעילה
  state.nextStep();
}

watch(allTooltipsSeen, (val) => {
  if (val && state.step === 6) {
    setTimeout(() => {
      state.nextStep()
    }, 600) // slight delay before advancing
  }
})

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
})

</script>

<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- Image -->
    <div class="relative"
      :class="{ 'border-2 border-[#00BEE5] rounded-md': visibleTooltips.image }"
    >
      <img :src="state.selectedDish.image" alt="Dish Image" class="w-full h-64 object-cover"
        v-tooltip="getTooltipContent('image')"
        @click.stop="showTooltipTemporarily('image')"
      />
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <!-- Title + Price -->
        <h1 class="text-2xl font-bold mb-2"
        >
          <span
           :class="{ 'border-2 border-[#00BEE5] rounded-md p-1': visibleTooltips.title }"
            v-tooltip="getTooltipContent('title')"
            @click.stop="showTooltipTemporarily('title')"
            class="cursor-pointer"
          >
            {{ state.selectedDish.name }}
          </span>
        </h1>
        <span class="text-[#00BEE5] text-lg font-semibold mb-2 cursor-pointer"
          :class="{ 'border-2 border-[#00BEE5] rounded-md p-1': visibleTooltips.price }"
          v-tooltip="getTooltipContent('price')"
          @click.stop="showTooltipTemporarily('price')"
        >
          ₪{{ state.selectedDish.price }}
        </span>

        <!-- Description -->
        <p class="text-gray-600 text-sm mt-2 mb-4 whitespace-pre-line cursor-pointer"
          :class="{ 'border-2 border-[#00BEE5] rounded-md p-1': visibleTooltips.description }"
          v-tooltip="getTooltipContent('description')"
          @click.stop="showTooltipTemporarily('description')"
        >
          {{ state.selectedDish.description }}
        </p>

        <div class="border-t pt-4 mt-4"></div>

        <!-- Preferences -->
        <div v-if="state.selectedDish.preferences"
         v-tooltip="getTooltipContent('preferences')"
          :class="{
            'border-2 border-[#00BEE5] rounded-md p-2': visibleTooltips.preferences
          }"
          class="space-y-6"
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
                @click.stop="showTooltipTemporarily('preferences')"

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
                @click.stop="showTooltipTemporarily('preferences')"
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

        <div class="mt-4 px-2 relative"
          :class="{ 'border-2 border-[#00BEE5] rounded-md p-1': visibleTooltips.notes }"
          v-tooltip="getTooltipContent('notes')"
          @click.stop="showTooltipTemporarily('notes')"
        >
          <label class="block text-sm font-medium text-gray-700 mb-1">הערות למנה (לא חובה):</label>
          <textarea
            v-model="notes"
            rows="2"
            placeholder="כתבו אם יש משהו שחשוב שנדע 😊"
            :disabled="state.step === 6 && !allTooltipsSeen"
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
      <div v-if="state.step !== 8" class="border-t pt-4 mt-4 sticky bottom-0 bg-white">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2 m-2.5">
            <button @click="decrease" class="w-8 h-8 rounded-full bg-gray-200 text-lg" :disabled="state.step === 6 && !allTooltipsSeen">−</button>
            <span class="font-medium">{{ quantity }}</span>
            <button @click="increase" class="w-8 h-8 rounded-full bg-gray-200 text-lg" :disabled="state.step === 6 && !allTooltipsSeen">+</button>
          </div>
          <button
            class="w-full bg-[#00BEE5] text-white py-3 rounded-xl text-lg font-semibold"
            :disabled="state.step === 6 && !allTooltipsSeen"
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
          class="w-[90%] bg-[#00BEE5] text-white py-3 rounded-xl text-lg font-semibold mx-auto max-w-md shadow-lg z-50"
          v-tooltip="{
            content: tooltipContent['finishOrder'],
            triggers: [],     // empty triggers = manual control
            shown: finishOrderTooltipShown,
            placement: 'top',
            html: true
          }"
          @click="finishOrder"
          >
          סיום הזמנה
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
</style>
