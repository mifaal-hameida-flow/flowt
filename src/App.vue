
<script setup>
import PopupGuide from './components/PopupGuide.vue';
import PopupGuideContent from './data/PopupGuideContent.json';
import HomeView from './views/HomeView.vue';
import Loader from './components/Loader.vue';
import {ref, onMounted} from 'vue';

const step = ref(0);
const showLoader = ref(true);
const nextStep = () => {
  step.value++;
}

onMounted(() => {
  setTimeout(() => {
    showLoader.value = false;
  }, 4000)
});

</script>

<template>
  <Loader v-if="showLoader"/>
  <div v-else>
    <HomeView/>
    <popupGuide
      :stepInfo="PopupGuideContent[step]"
      @next-step="nextStep"
    />
  </div>
</template>


