import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useResultStore = defineStore('result', () => {
  const result = ref(0)

  function setResult(newScore: number) {
    result.value = newScore
  }

  return { result, setResult }
})
