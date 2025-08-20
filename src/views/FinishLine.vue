<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAppState } from '../stores/appState'; 
import { logEvent } from '../logger';
import { getUserId } from '../user';
import { getCurrentViewComponent } from '../viewsMap';
const state = useAppState();
const userId = getUserId();
const component = getCurrentViewComponent(state.step);
// Confetti array
const confettiArray = ref([])

const generateConfetti = () => {
  const colors = ['#48cae4', '#90e0ef', '#ade8f4', '#00b4d8', '#0077b6']
  const count = 200  // doubled from 100 to 200 for a denser effect

  confettiArray.value = Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * -50,      // slightly higher start for more pieces falling
    z: Math.random() * 2,
    rotationX: Math.random() * 360,
    rotationY: Math.random() * 360,
    rotationZ: Math.random() * 360,
    rotSpeedX: 0.5 + Math.random() * 1,
    rotSpeedY: 0.5 + Math.random() * 1,
    rotSpeedZ: 0.5 + Math.random() * 1,
    width: 6 + Math.random() * 8,
    height: 8 + Math.random() * 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 0.2 + Math.random() * 0.8,
    sway: Math.random() * 2,
    swaySpeed: 0.01 + Math.random() * 0.02,
    shape: Math.random() > 0.5 ? 'rect' : 'triangle',
    swayPhase: Math.random() * Math.PI * 2
  }))
}

const animateConfetti = () => {
  confettiArray.value.forEach(c => {
    c.y += c.speed
    c.x += Math.sin(c.swayPhase) * c.sway
    c.swayPhase += c.swaySpeed
    c.rotationX += c.rotSpeedX
    c.rotationY += c.rotSpeedY
    c.rotationZ += c.rotSpeedZ

    // reset when below screen
    if (c.y > 120) {
      c.y = -10
      c.x = Math.random() * 100
      c.z = Math.random() * 2
    }
  })
  requestAnimationFrame(animateConfetti)
}


watch(() => state.showPopup, (newVal) => {
  if (newVal === false) {
    logEvent({
    userId,
    action: "session_end",
    route: component.__name,
    stepNumber: state.step,
    metadata: {
      message: "the user has finished all steps and popups"
    }
  });
  }
},  
{ immediate: true }
);


onMounted(() => {
  generateConfetti()
  animateConfetti()
})
</script>

<template>
  <div class="finish-line">
    <div class="finish-background"></div>

    <div class="confetti-container">
      <div
        v-for="(c, i) in confettiArray"
        :key="i"
        class="confetti"
        :style="{
          left: c.x + 'vw',
          top: c.y + 'vh',
          width: c.width + 'px',
          height: c.height + 'px',
          backgroundColor: c.shape === 'rect' ? c.color : 'transparent',
          clipPath: c.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
          transform: 'scale(' + (0.5 + c.z/2) + ') rotateX(' + c.rotationX + 'deg) rotateY(' + c.rotationY + 'deg) rotateZ(' + c.rotationZ + 'deg)'
        }"
      ></div>
    </div>

    <div class="popup-container">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.finish-line {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  perspective: 800px; /* gives a 3D effect */
}

/* Animated gradient */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.finish-background {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(270deg, #48cae4, #90e0ef, #ade8f4, #00b4d8);
  background-size: 800% 800%;
  animation: gradient 15s ease infinite;
  z-index: -2;
}

/* Confetti */
.confetti-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.confetti {
  position: absolute;
  opacity: 0.9;
  transform-origin: center center;
}

/* Centered popup */
/* .popup-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
} */
</style>
