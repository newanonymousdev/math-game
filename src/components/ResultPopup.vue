<script setup lang="ts">
import type { PopupMode } from '@/interface/interface'
import { useResultStore } from '@/stores/result'
import { ref, onMounted } from 'vue'
const props = defineProps<{
  popupData: {
    isCorrect: boolean
    isOpenPopup: boolean
    mode: PopupMode
  }
}>()

const { popupData } = props
const { isCorrect, mode } = popupData

// Emit để cha đóng popup
const emit = defineEmits(['next', 'restart', 'stop'])
function handleStartAgain() {
  // emit('close')
  // startGame()

  if (mode === 'next' && isCorrect) {
    emit('next') // báo parent sang câu tiếp theo
  } else {
    emit('restart') // báo parent reset game
  }
}

const countDown = ref(3)
let timer: number | null = null

function startTimer() {
  countDown.value = 3
  stopTimer()

  timer = window.setInterval(() => {
    countDown.value--

    if (countDown.value <= 0) {
      emit('next')
    }
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  if (isCorrect) {
    startTimer()
  }
})

const isLoadingStoreToRanking = ref(false)
function addScoreToRanking() {
  isLoadingStoreToRanking.value = true

  //fetch api

  emit('stop')
}

const { result } = useResultStore()
</script>

<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <!-- Popup box -->
    <div class="bg-white rounded-xl px-8 py-6 text-center shadow-xl animate-scale">
      <div class="text-2xl font-bold mb-4 flex flex-col">
        <p class="">
          {{ isCorrect ? '✔️ ' : '❌ ' }}
        </p>
        <p v-if="mode === 'next'">
          {{ isCorrect ? ' Đáp án chính xác!' : ' Rất tiếc đáp án của bạn không chính xác!' }}
        </p>
        <p v-if="mode === 'restart'">Rất tiếc đã hết thời gian trả lời!</p>
        <p v-if="!isCorrect" class="font-normal">
          Đáp án là:
          <span class="font-bold">
            {{ result }}
          </span>
        </p>
      </div>

      <div class="flex gap-2 justify-center">
        <button
          @click="addScoreToRanking"
          class="px-5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Ngừng chơi tại vòng này
        </button>

        <button
          v-if="isCorrect"
          @click="$emit('next')"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Qua câu hỏi tiếp ({{ countDown }})
        </button>
        <button
          v-if="!isCorrect"
          @click="handleStartAgain"
          class="px-5 py-2 bg-red-400 text-white rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Bắt đầu lại
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hiệu ứng popup nổi lên */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale {
  animation: scaleIn 0.25s ease-out;
}
</style>
