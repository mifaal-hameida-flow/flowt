<!-- components/ChartComponent.vue -->
<script setup>
import { computed } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'

// רישום רכיבים גלובליים (נדרש ב־chart.js 3+)
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

const props = defineProps({
  type: String,
  data: Array,
  xField: String,
  yField: String,
})

// הכנת הנתונים לגרף
const chartData = computed(() => {
  return {
    labels: props.data.map(item => item[props.xField]),
    datasets: [
      {
        label: props.yField,
        backgroundColor: '#48cae4',
        borderColor: '#0077b6',
        data: props.data.map(item => item[props.yField]),
      },
    ],
  }
})

// אפשרויות תצוגה בסיסיות
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<template>
  <div>
    <Bar v-if="type === 'bar'" :data="chartData" :options="chartOptions" />
    <Line v-else-if="type === 'line'" :data="chartData" :options="chartOptions" />
    <p v-else>לא נתמך: {{ type }}</p>
  </div>
</template>

<style scoped>
div {
  min-height: 300px;
}
</style>
