
<script setup>
import PopupGuide from './components/PopupGuide.vue';
import PopupGuideContent from './data/PopupGuideContent.json';
import HomeView from './views/HomeView.vue';
import {ref} from 'vue';

const step = ref(0);

const nextStep = () => {
  step.value++;
  console.log(step.value)
}

</script>

<template>
  <HomeView/>
<popupGuide
  :stepInfo="PopupGuideContent[step]"
  @next-step="nextStep"
/>

</template>


