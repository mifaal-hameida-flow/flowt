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

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
  return {
    date: date.toLocaleDateString('he-IL', optionsDate),
    time: date.toLocaleTimeString('he-IL', optionsTime)
  };
}
const goToRestaurant = (restaurantName) => {
    if (!showTooltip.value) { // אם זה אחרי שהפופאפ נסגר
      const restaurant = HistoryRestaurants.find(
      (r) => r.name === restaurantName);
       if (restaurant) {
         state.setRestaurant(restaurant);
        }
    }
}

const showTooltip = ref(true);

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
    <div class="font-bold text-3xl m-5">
      אהלן {{ state.userName }}!
    </div>

    <div class="flex-grow overflow-auto px-4">
        <div class="text-xl font-bold mb-4 text-right">הזמנות קודמות</div>

        <div
            v-for="(order, index) in sortedOrders"
            :key="index"
            class="flex justify-between items-center border-b py-4"
            @click="goToRestaurant(order.restaurantName)"
            >
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


    <BottomBar :active="'אזור אישי'" />
  </div>
</template>
