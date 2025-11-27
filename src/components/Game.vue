<template>
  <div class="p-6 max-w-md mx-auto text-center space-y-6">
    <p class="text-lg">Level: {{ level }} ({{ level + 1 }} digits)</p>

    <template v-if="isStarted">
      <!-- Timer + Progress bar -->
      <div class="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
        <div
          class="bg-red-500 h-full transition-all duration-1000"
          :style="{ width: (timeLeft / timeLimit) * 100 + '%' }"
        ></div>
      </div>
      <p class="text-xl font-semibold">⏱ {{ timeLeft }}s</p>

      <!-- Problem -->
      <div class="text-4xl font-bold my-4">
        {{ problem.a }} {{ problem.operator }} {{ problem.b }} =
      </div>

      <div class="">
        <input
          v-model="userAnswer"
          @keyup.enter="submitAnswer"
          type="text"
          placeholder="Your result?"
          class="min-w-32 w-max max-w-full text-center text-3xl font-bold bg-transparent border-none outline-none focus:outline-none focus:ring-0"
        />
      </div>
    </template>
    <button
      v-if="!isStarted"
      @click="startGame"
      class="px-5 py-2 cursor-pointer bg-yellow-900 text-white rounded-xl text-lg mt-4"
    >
      Bắt đầu chơi
    </button>
    <button
      v-if="isStarted"
      @click="submitAnswer"
      class="px-5 py-2 cursor-pointer bg-blue-600 text-white rounded-xl text-lg mt-4"
    >
      Check
    </button>
  </div>

  <template v-if="popupData.isOpenPopup">
    <ResultPopup
      :popupData="popupData"
      @next="goToNextQuestion"
      @restart="restartGame"
      @stop="popupData.isOpenPopup = false"
    />
  </template>
</template>

<script setup lang="ts">
import ResultPopup from '@/components/ResultPopup.vue'
import type { PopupMode } from '@/interface/interface'
import { useResultStore } from '@/stores/result'
import { useScoreStore } from '@/stores/score'
import { ref, watch } from 'vue'

/* -------------------------------
   1. Utility
--------------------------------*/
function randomNumberByDigits(digits: number): number {
  const min = Math.pow(10, digits - 1)
  const max = Math.pow(10, digits) - 1
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomOperator(): '+' | '-' {
  return Math.random() > 0.5 ? '+' : '-'
}

/* -------------------------------
   2. State
--------------------------------*/
const level = ref(1)
const streak = ref(0)
const isStarted = ref(false)

const userAnswer = ref('')
const problem = ref({
  a: 0,
  b: 0,
  operator: '+' as '+' | '-',
  answer: 0,
})

const { incrementScore, setScore } = useScoreStore()

const popupData = ref({
  isCorrect: false,
  isOpenPopup: false,
  mode: 'next' as PopupMode,
})

/* TIMER */
const timeLimit = 10 // giây / câu
const timeLeft = ref(timeLimit)
let timer: number | null = null

/* -------------------------------
   3. Level logic
--------------------------------*/
function updateLevel() {
  streak.value++

  if (streak.value >= 3) {
    level.value++
    streak.value = 0
  }
}

function goToNextQuestion() {
  popupData.value.isOpenPopup = false
  startGame() // sang câu tiếp theo
}

function restartGame() {
  setScore(0)
  level.value = 1
  streak.value = 0
  popupData.value.isOpenPopup = false

  startGame() // chơi lại từ đầu
}

/* -------------------------------
   4. Timer logic
--------------------------------*/
function startTimer() {
  stopTimer()
  timeLeft.value = timeLimit

  timer = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      // hết giờ => tính là sai
      handleAnswer(false, true)
    }
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const { result, setResult } = useResultStore()
/* -------------------------------
   5. Generate problem
--------------------------------*/
function generateProblem() {
  const digits = level.value + 1

  const a = randomNumberByDigits(digits)
  const b = randomNumberByDigits(digits)
  const operator = randomOperator()
  const answer = operator === '+' ? a + b : a - b
  setResult(answer)

  problem.value = { a, b, operator, answer }
  userAnswer.value = ''

  startTimer()
}

/* -------------------------------
   6. Submit logic
--------------------------------*/

function handleAnswer(isCorrect: boolean, timeout = false) {
  stopTimer()
  isStarted.value = false

  if (timeout) {
    // alert('⏱ Hết giờ! Sai rồi.')

    popupData.value = {
      isCorrect: false,
      isOpenPopup: true,
      mode: 'restart',
    }
  } else {
    // alert(isCorrect ? '✔️ Đúng rồi!' : '❌ Sai rồi!')

    popupData.value = {
      isCorrect,
      isOpenPopup: true,
      mode: 'next',
    }
    if (isCorrect) {
      updateLevel()
      incrementScore(level.value)
    }
  }
}

function submitAnswer() {
  const isCorrect = Number(userAnswer.value) === problem.value.answer

  handleAnswer(isCorrect)
}

function startGame() {
  isStarted.value = true
}

watch(isStarted, (newValue) => {
  if (newValue) {
    generateProblem()
  }
})

/* -------------------------------
   7. Lifecycle
--------------------------------*/
// onMounted(() => {
//   generateProblem()
// })

// onUnmounted(() => {
//   stopTimer()
// })
</script>

<style scoped></style>
