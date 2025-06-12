<script setup>
</script>

<template>
    <div class="flex between fixed top-0 mt-2  w-full z-50">
        <div class="flex space-x-1 items-center">
            <div class="icon-bg mr-2">
                <img class="w-6 h-6" src="../assets/media/topbar/map-location.png" />
            </div>
            <p>המיקום שלי</p>
        </div>
        <div class="icon-bg ml-2" >
            <img class="w-6 h-6" src="../assets/media/topbar/filter.png"/>
        </div>
    </div>
</template>

<style scoped>
.between {
    justify-content: space-between;
}

.icon-bg {
  background-color: rgba(0, 0, 0, 0.05); /* light gray background */
  padding: 6px;
  border-radius: 9999px; /* fully rounded */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>