<template>
  <p>Your score:{{ score }}</p>
</template>

<script setup lang="ts">
import { useScoreStore } from '@/stores/score'
import { storeToRefs } from 'pinia'

const scoreStore = useScoreStore()
const { score } = storeToRefs(scoreStore)
</script>

<style scoped></style>
