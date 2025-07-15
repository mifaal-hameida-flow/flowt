<script setup>
import { ref, onMounted, computed, watch} from 'vue';
import { popupState } from '../stores/popup';
import { useAppState } from '../stores/appState'; 
import OrdersTable from '../data/OrdersTable.json'
const state = useAppState();
const originalOrders = OrdersTable;
const newOrders = ref([]); // This will hold orders added by סיום הזמנה
const orders = computed(() => [...originalOrders, ...newOrders.value]); // merged list for display
// Props
const props = defineProps({
  stepInfo: Object,
});

const cardNumber = ref(state.cardNumber || 0);
// const firstCard = computed(() => props.stepInfo?.cards?.[cardNumber.value]);
const firstCard = computed(() => {
  if (popupState.manualCard !== null) return popupState.manualCard;
  return props.stepInfo?.cards?.[cardNumber.value ?? 0];  // כאן לוודא שיש default
});

const showPopup = ref(false);
const chosenView = computed(() => state.activeSubView);

const selectedMessages = computed(() => {
  if (!chosenView.value) {
    return [];
  }
  const currentMessages = firstCard.value?.messageOptions || [];
  const match = currentMessages.find(item => chosenView.value in item);
  return match ? match[chosenView.value] : [];
});

const isDatabaseAnimationCard = computed(() => {
  return props.stepInfo.step === 8 && firstCard.value?.id === 2;
});
const animatedRows = ref([]);
const fullOrderData = computed(() => state.currOrder || []);

const handlePopupDisplay = (newCard) => {
  if (!newCard) {
    showPopup.value = false;
    return;
  }

  if (newCard.delay) {
    showPopup.value = false; // Hide immediately
    setTimeout(() => {
      showPopup.value = true;
    }, newCard.delay);
  } else {
    showPopup.value = true;
  }
};
const animateOrderToTable = async () => {
  animatedRows.value = []; // reset before animation

  for (const order of fullOrderData.value) {
    const restaurantName = order.restaurantName?.restaurantName || order.restaurantName; // if it's an object

    for (const dish of order.items) {
      animatedRows.value.push({
        dishName: dish.dishName,
        quantity: dish.quantity,
        totalPrice: dish.totalPrice,
        notes: dish.notes,
        preferences: dish.preferences,
        restaurantName
      });

      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
};


// State
const userName = ref(state.userName || '');
const isValid = ref(false);
const showGreeting = ref(false);
// Regex: Only Hebrew, English letters, spaces (optional)
const nameRegex = /^[A-Za-zא-ת\s]+$/;

const isDev = import.meta.env.DEV;
const isObject = (val) => val && typeof val === 'object';

// optionally remove deeply nested values
const filteredFields = computed(() => {
  const clone = {}
  for (const key in state.selectedRestaurant) {
    clone[key] = state.selectedRestaurant[key]
  }
  return clone
})


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
    state.saveName(userName.value);
    showGreeting.value = true;
  }
};

// Clear input
const clearInput = () => {
  userName.value = '';
  isValid.value = false;
  showGreeting.value = false;
};

const handleTaskClick = () => {
  // Only auto-advance on step 0
  if ( props.stepInfo.step === 0 || props.stepInfo.step === 2) {
    state.nextStep();
  } else {
    state.closePopup();
    if (props.stepInfo.step === 3 && popupState.manualCard || props.stepInfo.step === 5 && popupState.manualCard) {
      handleManualClose();
    }
  }

};

const handleCard = (event) => {
 if (event.currentTarget.alt.includes("next")) {
    cardNumber.value++;
 } else {
    cardNumber.value--;
 }
 state.updateCardNumber(cardNumber.value);
};

const handleManualClose = () => {
  popupState.isVisible = false;
  popupState.manualCard = null;
};

const handleOptionsClick = (button) => {
  state.navigateView(button.id);
  state.nextStep();
}
const userIP = generateFakeIP();

function generateFakeIP() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

const completeOrder = () => {
  const dynamicOrder = state.orderHistory?.[0];
  if (!dynamicOrder) return;
  const newOrder = {
    order_id: `ORD-${Date.now()}`,
    user_id: `${state.userName || 'guest'}_${userIP || 'unknownIP'}`,
    restaurant: dynamicOrder.restaurantName?.restaurantName || dynamicOrder.restaurantName || 'לא ידוע',
    created_at: new Date().toISOString(),
    items: dynamicOrder.items.map(item => item.dishName),
    total: dynamicOrder.items.reduce((sum, item) => sum + item.totalPrice, 0),
    status: 'completed',
    isNew: true // flag for animation
  };

  newOrders.value.push(newOrder);
};

watch(() =>  props.stepInfo, () => {
  cardNumber.value = state.cardNumber || 0;
  handlePopupDisplay( props.stepInfo?.cards?.[cardNumber.value]);
}, { immediate: true });

watch(isDatabaseAnimationCard, (isActive) => {
  if (isActive) {
    animatedRows.value = [];
    animateOrderToTable();
  }
});

onMounted(() => {
  if (state.userName) {
    userName.value = state.userName;
    showGreeting.value = true;
    isValid.value = true;
  }
});
</script>
<template>
  <div v-if="(showPopup || popupState.isVisible) && stepInfo" class="fixed top-0 right-0 z-60 bg-black/[.75] w-screen h-screen flex justify-center items-center"  
  :key="`${stepInfo.step}-${cardNumber}`"
  :class="{ 'fade-enter': firstCard.id === 1 }">
    <div class="flex flex-col mx-8 my-4 items-center justify-center bg-[#E6F8FA] p-4 rounded-xl shadow-lg text-center popup-container"
    :key="`${stepInfo.step}-${cardNumber}`" 
    :class="{ 'animate-zoom': firstCard.id === 1 }">
      
      <p v-if="firstCard.preTitle" class="mb-3">{{ firstCard.preTitle }}</p>
      <h2 v-if="firstCard.title" class="text-xl font-bold mb-4 text-[#48cae4] font-title [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)]">{{ firstCard.title }}</h2>

      <div v-if="firstCard.table" class="w-full overflow-auto max-w-full mb-2">
        <table class="info-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in filteredFields" :key="key">
              <td>{{ key }}</td>
              <td>
              <span  v-if="!isObject(value)" :class="{ direction: ['logo', 'src'].includes(key) }">
                {{ value }}
              </span>
                <span v-else>
                  [Nested Object]
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="firstCard.message" v-for="(paragraph, idx) in firstCard.message" :key="idx" class="mb-3">
        <!-- <p>{{ paragraph }}</p> -->
         <p v-html="paragraph"></p>
         <!-- Database Animation Table -->
      </div>

      <div v-if="isDatabaseAnimationCard" class="w-full max-w-full mx-auto mt-4 table-scroll-wrapper">
        <div class="overflow-x-auto w-full">
          <table class="info-table animate-table">
            <thead>
              <tr class="whitespace-nowrap">
                <th>מנה</th>
                <th>כמות</th>
                <th>סה"כ</th>
                <th>הערות</th>
                <th>העדפות</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in animatedRows" :key="idx" class="animate-fade-in">
                <td>{{ row.dishName }}</td>
                <td>{{ row.quantity }}</td>
                <td class="whitespace-nowrap">{{ row.totalPrice.toFixed(2) }}</td>
                <td>{{ row.notes || '-' }}</td>
                <td>
                  <div v-if="row.preferences">
                    <div v-for="(value, key) in row.preferences" :key="key" class="whitespace-nowrap">
                      <strong>{{ key }}: </strong>
                      <span v-if="Array.isArray(value)">
                        {{ value.join(', ') }}
                      </span>
                      <span v-else>
                        {{ value }}
                      </span>
                    </div>
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
       <div v-if="firstCard.ordersTable" class="w-full overflow-auto max-w-full mb-2 table-scroll-wrapper">
          <table class="info-table">
            <thead>
              <tr class="whitespace-nowrap">
                <th>מזהה הזמנה</th>
                <th>מזהה משתמש</th>
                <th>מסעדה</th>
                <th>תאריך</th>
                <th>מנות</th>
                <th>סה״כ</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.order_id"  :class="['animate-slide-fade-in',{ 'highlight-new-row': order.isNew }]">
                <td>{{ order.order_id }}</td>
                <td>{{ order.user_id }}</td>
                <td>{{ order.restaurant }}</td>
                <td class="whitespace-nowrap">{{ new Date(order.created_at).toLocaleDateString('he-IL') }}</td>
                <td class="text-right">
                  <ul class="list-disc pr-2">
                    <li v-for="item in order.items" :key="item">{{ item }}</li>
                  </ul>
                </td>
                <td>{{ order.total.toFixed(2) }} ₪</td>
                <td>
                  <span :class="{
                    'text-green-600': order.status === 'completed',
                    'text-red-600': order.status === 'cancelled',
                    'text-gray-600': order.status === 'pending'
                  }">
                    {{ order.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          </div>

          <div v-if="firstCard.ordersTable">
            <div v-if="newOrders.length === 0" style="overflow-x: auto; display: flex; justify-content: center; margin-top: 0.5rem;">
              <button
                @click="completeOrder"
                class="bg-[#48cae4] text-white px-4 py-2 rounded-md shadow-sm hover:bg-[#3bb0cc] transition"
              >
                סיום הזמנה
              </button>
            </div>
          </div>
                    <!-- סיום הזמנה button -->
          
        


      <div v-if="firstCard.messageTable" class="flex">
        <div v-for="(table, idx) in firstCard.messageTable" :key="idx" class="flex flex-col items-center pr-1.5"
         :class="{ 'border-r-1 border-[#48cae4]': idx === firstCard.messageTable.length - 1 }">
          <p class="text-xl font-bold mb-4 text-[#48cae4] font-title [text-shadow:1px_1px_2px_rgba(0,0,0,0.3)]">{{ table.title }}</p>
           <p v-for="message in table.message" v-html="message"></p> 
        </div>
      </div>
      
      <div
        v-if="selectedMessages.length"
        v-for="(paragraph, idx) in selectedMessages"
        :key="idx"
        class="mb-3"
      >
        <!-- <p>{{ paragraph }}</p> -->
        <p v-html="paragraph"></p>
      </div>

      <!-- only relevant for the first step -->
       <div v-if="stepInfo.step === 0" class="w-full flex flex-col items-center">
                <!-- Button with text and image -->
            <div v-if="firstCard.buttonTask && showGreeting"
                class="px-4 py-2 bg-white flex items-center justify-between rounded-lg shadow-sm mt-2"
                @click="handleTaskClick"
                >
                    <p class="text-s text-[#48cae4]">{{ firstCard.buttonTask.msg }}</p>
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
                class="mt-2 bg-[#48cae4] text-white px-4 py-1 rounded text-sm"
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
        <div class="w-full flex items-center">
            <div class="w-full flex justify-start" v-if="firstCard.buttonBack">
                <img @click="handleCard" class="mr-2 h-10 w-10 object-contain color-filter" src="/media/buttons/back-arrow.png" alt="back button"/>
            </div>
            <div class="w-full flex justify-end" v-if="firstCard.buttonNext">
                <img @click="handleCard" class="mr-2 h-10 w-10 object-contain color-filter" src="/media/buttons/next-arrow.png" alt="next button"/>
            </div>

            <div class="w-full flex justify-around" v-if="firstCard.buttonOptions">
                <span v-for="button in firstCard.buttonOptions" @click="handleOptionsClick(button)" class="px-2 py-1 bg-white flex items-center justify-between rounded-lg shadow-sm mt-2 m-2">
                    <p class="text-sm text-[#48cae4]">{{ button.msg }}</p>
                    <img :src="button.src" alt="task image" class="mr-1 h-6 w-6 object-contain" />
                </span>
            </div>

            <div class="w-full flex"  v-if="firstCard.buttonTask && stepInfo.step !== 0"
              :class="{
                'justify-center': firstCard.buttonTask && !firstCard.buttonNext && !firstCard.buttonBack,
                'justify-end': firstCard.buttonTask && (firstCard.buttonNext || firstCard.buttonBack)
              }">
                <span @click="handleTaskClick" class="px-2 py-1 bg-white flex items-center justify-between rounded-lg shadow-sm mt-2">
                    <p class="text-sm text-[#48cae4]">{{ firstCard.buttonTask.msg }}</p>
                    <img :src="firstCard.buttonTask.src" alt="task image" class="mr-1 h-6 w-6 object-contain" />
                </span>
            </div>
         </div>
        
    </div>
  </div>
</template>

<style scoped>

input:focus {
  border: 1px solid #48cae4;
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

.direction {
  direction: ltr;
  text-align: left;
  unicode-bidi: plaintext; /* Ensures full LTR rendering */
  font-family: monospace;  /* Optional: for clearer path display */
}

.color-filter {
  filter: brightness(116%) hue-rotate(-16deg);
}

@keyframes fadeInRow {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInRow 0.4s ease-out;
}


.info-table th,
.info-table td {
  border: 1px solid #8bbcc6;
  padding: 5px;
  text-align: center;
  word-break: break-word;
}

.info-table th {
  background-color: #b4e1ee57;
}

.overflow-x-auto {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.animate-fade-in {
  animation: fadeInRow 0.4s ease-out;
}

.table-scroll-wrapper {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
   margin-bottom: 0.5rem;
}

/* Remove or adjust this */
.info-table {
  width: max-content;
  min-width: 600px; /* You can lower this if needed */
  border-collapse: collapse;
  font-size: x-small;
  margin-bottom: 1rem;
}

/* Optional: Keep the popup from expanding */
.popup-container {
  width: 100%;
  max-width: 90vw;
  overflow-x: hidden; /* prevent growing beyond screen */
  box-sizing: border-box;
}

/* אנימציית כניסה עם שקיעה מלמטה לעליון + fade-in */
@keyframes slideFadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-fade-in {
  animation: slideFadeInUp 0.5s ease forwards;
}

/* צבע רקע צהוב שמישאר (הדגשה קבועה) */
.highlight-new-row {
  background-color: #fff3cd;
}


</style>