import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', () => {
  const score = ref(0)

  function incrementScore(newScore: number) {
    score.value += newScore
  }
  function setScore(newScore: number) {
    score.value = newScore
  }

  return { score, incrementScore, setScore }
})
