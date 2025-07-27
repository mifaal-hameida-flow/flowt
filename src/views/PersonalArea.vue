<script setup>
import BottomBar from '../components/BottomBar.vue';
import { useAppState } from '../stores/appState';
import orderHistory from '../data/OrderHistory.json';
import HistoryRestaurants from '../data/HistoryRestaurants.json'
import { computed, watch, ref } from 'vue';

const state = useAppState();
const combinedOrders = [...orderHistory, ...state.orderHistory];
const sortedOrders = computed(() => {
  return combinedOrders.slice().sort((a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime));
});

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

// const goToRestaurant = (restaurantName) => {
//     if (!showTooltip.value) { // אם זה אחרי שהפופאפ נסגר
//       const restaurant = HistoryRestaurants.find(
//       (r) => r.name === restaurantName);
//        if (restaurant) {
//          state.setRestaurant(restaurant);
//         }
//     }
// }

const showTooltip = ref(true);
const filterPanelOpen = ref(false);
const selectedCategory = ref(null);
const selectedRating = ref(0);

// טווח תאריכים אופציונלי:
const startDate = ref(null);
const endDate = ref(null);

const resetFilters = () => {
  selectedCategory.value = null;
  selectedRating.value = 0;
  startDate.value = null;
  endDate.value = null;
};


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

    <div class="flex justify-start gap-6 font-bold text-3xl m-5">
      <div class="max-w-[80%] break-words leading-tight">
        אהלן {{ state.userName }}!
      </div>
      <button v-if="state.step===9 && !state.showPopup" @click="filterPanelOpen = !filterPanelOpen" class="text-sm bg-[#48cae4] text-white py-1 px-3 rounded-xl z-60">
        סינון הזמנות
        <img 
        class="h-8 w-8 filter-class"
        src="../assets/media/topbar/filter.png">
      </button>
    </div>


    <div class="flex-grow overflow-auto px-4">
        <div class="text-xl font-bold mb-4 text-right">הזמנות קודמות</div>

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

     <div v-if="filterPanelOpen" class="absolute bottom-0 z-60 bg-gray-50 border-t p-4 rounded-t-xl shadow-md">
      <div class="mb-2 font-semibold text-right">סוג אוכל</div>
      <div class="flex flex-wrap gap-2 justify-end mb-4">
        <button
          v-for="type in ['אסייתי', 'איטלקי', 'בשרים', 'ישראלי']"
          :key="type"
          @click="selectedCategory = selectedCategory === type ? null : type"
          :class="[
            'px-3 py-1 rounded-full border',
            selectedCategory === type ? 'bg-[#48cae4] text-white' : 'bg-white text-gray-700'
          ]"
        >
          {{ type }}
        </button>
      </div>

      <div class="mb-2 font-semibold text-right">דירוג מינימלי</div>
      <div class="flex gap-2 justify-end mb-4">
        <button
          v-for="n in 5"
          :key="n"
          @click="selectedRating = selectedRating === n ? 0 : n"
          :class="[
            'px-2 py-1 border rounded-full',
            selectedRating === n ? 'bg-[#48cae4] text-white' : 'bg-white text-gray-700'
          ]"
        >
          {{ n }}★ ומעלה
        </button>
      </div>

      <div class="flex justify-between">
        <button @click="resetFilters" class="text-sm text-red-500 underline">איפוס</button>
        <button @click="filterPanelOpen = false" class="text-sm text-gray-700">סגור</button>
      </div>
    </div>

    <BottomBar :active="'אזור אישי'" />
  </div>
</template>

<style scoped>
.filter-class {
  filter: invert(1) brightness(2);
}
</style>