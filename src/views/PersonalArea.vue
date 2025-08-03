<script setup>
import BottomBar from '../components/BottomBar.vue';
import { useAppState } from '../stores/appState';
import orderHistory from '../data/OrderHistory.json';
import HistoryRestaurants from '../data/HistoryRestaurants.json'
import { computed, watch, ref } from 'vue';

const state = useAppState();
const combinedOrders = [...orderHistory, ...state.currOrderHistory];
const sortedOrders = computed(() => {
  return combinedOrders.slice().sort((a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime));
});

const showTooltip = ref(true);
const startDate = ref(null);
const endDate = ref(null);
const filterPanelOpen = ref(false);
const selectedCategory = ref(null);
const selectedRating = ref(null);

const filteredOrders = computed(() => {
  return sortedOrders.value.filter(order => {
 const matchesCategory = selectedCategory.value
  ? order.type && order.type.includes(selectedCategory.value)
  : true;

    const matchesRating = selectedRating.value ? (order.rating || 0) >= selectedRating.value : true;

    const orderDate = new Date(order.orderDateTime);
    const matchesStartDate = startDate.value ? orderDate >= new Date(startDate.value) : true;
    const matchesEndDate = endDate.value ? orderDate <= new Date(endDate.value) : true;

    return matchesCategory && matchesRating && matchesStartDate && matchesEndDate;
  });
});

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
  return {
    date: date.toLocaleDateString('he-IL', optionsDate),
    time: date.toLocaleTimeString('he-IL', optionsTime)
  };
}

const foodTypes = ['המבורגר', 'בשרים', 'ישראלי', 'אסייתי', 'איטלקי', 'הודי']; // או מה שאת צריכה

const hasActiveFilters = computed(() =>
  selectedCategory.value || selectedRating.value || startDate.value || endDate.value
);

function toggleCategory(category) {
  selectedCategory.value = selectedCategory.value === category ? null : category;
}

function toggleRating(rating) {
  selectedRating.value = selectedRating.value === rating ? null : rating;
}

function clearFilters() {
  selectedCategory.value = null;
  selectedRating.value = null;
  startDate.value = null;
  endDate.value = null;
  state.clearFilters();
}


function applyFilters() {
  filterPanelOpen.value = false;
  state.updateFilters({
    selectedCategory: selectedCategory.value,
    selectedRating: selectedRating.value,
    startDate: startDate.value,
    endDate: endDate.value
  });
  state.nextStep();
}



watch(() => state.showPopup, (newVal) => {
  if (newVal === false) {
    showTooltip.value = false;
  }
},  
{ immediate: true }
);

</script>
<template>
  <div class="flex flex-col min-h-screen bg-white">

    <div class="flex flex-col items-start justify-between px-5 pt-5 gap-2 mb-2">
      <div class="text-3xl font-bold leading-tight break-words max-w-[70%] text-right">
        אהלן {{ state.userName }}!
      </div>

      <button
        v-if="state.step === 9 && !state.showPopup"
        @click="filterPanelOpen = !filterPanelOpen"
        class="flex items-center gap-1 bg-[#48cae4] text-white px-3 py-1.5 rounded-full text-sm shadow-md"
          v-tooltip="!filterPanelOpen && !state.progressBarOpen ? {
                    content: 'לחצו עליי כדי להתחיל לסנן!',
                    triggers: [],
                    shown: true,
                    placement: 'left',
                    html: true
                } : null"
                >
      <img
          class="h-5 w-5 filter-class"
          src="../assets/media/topbar/filter.png"
        />
        סינון
        
      </button>
    </div>


    <div class="flex-grow overflow-auto px-4">
        <div class="text-xl font-bold mb-2 text-right">הזמנות קודמות</div>
        <div class="text-normal font-bold mb-2 text-right" v-if="filteredOrders.length === 0">לא נמצאו הזמנות מתאימות למסננים שבחרת</div>

        <div
            v-for="(order, index) in filteredOrders"
            :key="index"
            class="flex justify-between items-center border-b py-4"
            >
            <!--   @click="goToRestaurant(order.restaurantName)" -->
              <!-- צד ימין: שם המסעדה + שעה ותאריך -->
            <div class="flex flex-col text-right">
                <div class="font-semibold text-lg leading-tight"
                  v-tooltip="index === 0 ? {
                    content: 'הנה ההזמנה שביצעתם עכשיו –<br> נוספה להיסטוריית ההזמנות שלכם!',
                    triggers: [],
                    shown: showTooltip,
                    placement: 'top',
                    html: true
                } : null">
                    {{ order.restaurantName }}
                </div>
                <div class="text-sm text-gray-500 mt-1">
                    {{ formatDateTime(order.orderDateTime).time }} ,{{ formatDateTime(order.orderDateTime).date }}
                </div>
            </div>
            
            <!-- צד שמאל: המחיר -->
            <div class="text-sm text-gray-500 min-w-[70px] text-left">
                 ₪ {{ order.orderPrice ? Number(order.orderPrice).toFixed(2) : '--' }}
            </div>

          
        </div>
     </div>
     <!-- Overlay כהה -->
    <div v-if="filterPanelOpen" class="fixed inset-0 z-40 bg-black" style="background-color: rgba(0, 0, 0, 0.4);" @click="filterPanelOpen = false"></div>

    <transition name="slide-up">
      <div
        v-if="filterPanelOpen"
        class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl p-5 z-55 max-h-[95vh] overflow-y-auto"
      >
        <!-- כפתור סגירה (איקס) -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-right">סינון</h2>
                  <!-- מחיקת מסננים -->
        <div
          v-if="hasActiveFilters"
          class="text-sm text-[#009de0] text-center cursor-pointer"
          @click="clearFilters"
        >
          מחיקת מסננים
        </div>

          <button @click="filterPanelOpen = false" class="text-gray-500 text-2xl leading-none px-2">
            &times;
          </button>
        </div>

        <!-- סוג אוכל -->
        <div class="mb-5">
          <div class="mb-4 font-semibold text-right">סוג אוכל</div>
          <div class="flex flex-wrap gap-2 justify-evenly">
            <button
              v-for="category in foodTypes"
              :key="category"
              @click="toggleCategory(category)"
              :class="[
                'px-4 py-1 rounded-2xl transition-all duration-200',
                selectedCategory === category
                  ? 'bg-[#e0f7ff] border-[#009de0] text-[#009de0]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>
        </div>

        <!-- דירוג -->
        <div class="mb-5">
          <div class="mb-4 font-semibold text-right">דירוג</div>
          <div class="flex flex-wrap gap-2 justify-evenly">
            <button
              v-for="rating in [5, 4, 3, 2, 1]"
              :key="rating"
              @click="toggleRating(rating)"
              :class="[
                'px-4 py-1 rounded-2xl transition-all duration-200',
                selectedRating === rating
                  ? 'bg-[#e0f7ff] border-[#009de0] text-[#009de0]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              ⭐{{ rating }} 
              <div class="text-sm">ומעלה</div>
            </button>
          </div>
        </div>

        <!-- טווח תאריכים -->
        <div class="mb-6">
          <div class="mb-2 font-semibold text-right">טווח תאריכים</div>
          <div class="flex flex-col gap-2">
            <input
              type="date"
              v-model="startDate"
              class="border rounded-lg p-2 text-right"
              placeholder="מתאריך"
            />
            <input
              type="date"
              v-model="endDate"
              class="border rounded-lg p-2 text-right"
              placeholder="עד תאריך"
            />
          </div>
        </div>

        <!-- כפתור סינון -->
        <button
          @click="applyFilters"
          class="w-full bg-[#009de0] text-white py-3 rounded-full font-semibold text-lg shadow-md"
        >
          סינון (נמצאו {{ filteredOrders.length }})
        </button>
      </div>
    </transition>


    
    <BottomBar :active="'אזור אישי'" />
  </div>
</template>

<style scoped>
.filter-class {
  filter: invert(1) brightness(2);
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}


</style>