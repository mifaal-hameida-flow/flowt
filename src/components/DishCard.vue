<script setup>
import { popupState } from '../stores/popup';

const props = defineProps({
  dish: {
    type: Object,
    required: true
  },
  step: Number
});

const handleMenuItem = () => {

  if (props.step === 3) {
    popupState.manualCard = {
          id: 'manual-1',
          title: 'אופס!',
          message: ['אי אפשר ללחוץ על זה עכשיו...🫣', 'כנראה שתצטרכו לנסות את האיטלקי קודם'],
          buttonTask: {
            msg: 'הבנתי',
            src: '././media/buttons/knowledge.png'
          }
    };
    popupState.isVisible = true;
  }
}

</script>

<template>
  <div
    @click="handleMenuItem"
    class="flex items-center bg-white rounded-xl overflow-hidden shadow-md transition duration-300 w-full dish-card"
    dir="rtl"
  >
    <!-- טקסט -->
    <div class="flex flex-col justify-between p-4 flex-grow min-w-0 text-right">
      <div>
        <h3 class="text-base font-semibold text-gray-900 leading-tight truncate">
          {{ dish.name }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2 break-words overflow-hidden text-ellipsis">
          {{ dish.description }}
        </p>
      </div>
      <p class="text-sm text-[#009DE0] mt-2">
        ₪{{ dish.price }}
      </p>
    </div>

    <div class="flex items-center justify-center h-full p-2 flex-shrink-0 ">
          <!-- תמונה -->
      <img
        :src="dish.image"
        :alt="dish.name"
        class="w-28 h-28 object-cover rounded-xl flex-shrink-0 align-center"
      />
    </div>
  </div>
</template>

