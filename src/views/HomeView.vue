<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import RestaurantsContent from '../data/RestaurantsContent.json';
import BottomBar from '../components/BottomBar.vue';
import TopBar from '../components/TopBar.vue';
import { popupState } from '../stores/popup';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
const emit = defineEmits(['restaurant-selected']);
const isScrolled = ref(false);
const props = defineProps({
  stepNumber: Number
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const selectRestaurant = (restaurant) => {
  emit('restaurant-selected', restaurant);
}

const stageTitle = computed(() => {
  const step = props.stepNumber;

  if (step <= 2) {
    return { title: 'מסעדות', subtitle: 'כל המסעדות' };
  } else if (step === 4) {
    return { title: 'המלצות', subtitle: 'מומלץ עבורך' };
  } else {
    return { title: '', subtitle: '' };
  }
});

</script>

<template>
    <div class="bg-white w-screen min-h-screen flex flex-col relative pt-16">
        <div class="flex-1 overflow-y-auto pb-4">
            <div class="font-bold text-2xl mr-3">{{ stageTitle.title }}</div>
            <div class="mr-4 mb-1 text-xl">{{ stageTitle.subtitle }}</div>
            <RestaurantCard
                v-for="(restaurant, index) in RestaurantsContent"
                :key="index"
                :restaurantInfo="restaurant"
                @click="selectRestaurant(restaurant)"
                />
        </div>
        <TopBar :scrolled="isScrolled"/>     
        <BottomBar :step="stepNumber"/>

    </div>
</template>

<style scoped>

</style>