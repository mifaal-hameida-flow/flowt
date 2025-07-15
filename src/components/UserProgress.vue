<!-- <script setup>
import ConceptsData from '../data/ConceptsData.json'
import { useAppState } from '../stores/appState'; 
import { ref, computed } from 'vue';
const state = useAppState();

const totalSteps = ref(20); // סתם המצאתי

const progressPercent = computed(() =>
  Math.min(100, Math.round((state.step / totalSteps.value) * 100))
)
</script>
<template>
  <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
    <div
      class="bg-green-500 h-full transition-all duration-500"
      :style="{ width: progressPercent + '%' }"
    />
  </div>
</template>
 -->

<script setup>
import CircleProgress from 'vue3-circle-progress'
import ConceptsData from '../data/ConceptsData.json'
import { useAppState } from '../stores/appState'; 
import { ref, computed } from 'vue';
const state = useAppState();
const totalSteps = ref(20); // סתם המצאתי


const progressPercent = computed(() =>
  Math.min(100, Math.round((state.step / totalSteps.value) * 100))
)
</script>

<template>
  <CircleProgress
    :percent="progressPercent"
    :size="80"
    :stroke-width="10"
    stroke-color="#22c55e"
    track-color="#e5e7eb"
    animation
  />
</template>
