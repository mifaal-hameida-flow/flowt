<script setup>
import { useAppState } from '../stores/appState'
const state = useAppState()
const props = defineProps({
  data: { type: Array, required: true }
});// הנתונים כבר קיימים ב־state.graphData.orderHistoryGroupedByType

const keys = props.data.length ? Object.keys(props.data[0]) : [];
</script>


<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <table class="w-full text-center">
      <thead class="bg-[#E6F9FC] text-[#006B80]">
        <tr>
          <th
            v-for="(key, index) in keys"
            :key="index"
            class="py-2 px-4"
          >
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in props.data"
          :key="rowIndex"
          :class="rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F7FCFD]'"
        >
          <td
            v-for="(key, colIndex) in keys"
            :key="colIndex"
            class="py-2 px-4 text-center"
          >
            {{ row[key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  border: 1px solid #ddd;
}
</style>
