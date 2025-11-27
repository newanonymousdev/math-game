<template>
  <div class="bg-yellow-100 min-h-screen flex">
    <div class="w-1/4"></div>
    <div
      class="w-1/2 bg-linear-to-r from-yellow-100 from-10% via-amber-300 to-yellow-100 to-90% flex justify-center flex-col"
    >
      <GameTitle />
      <Game />
    </div>
    <div class="w-1/4">
      <GameRankings />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameTitle from './GameTitle.vue'
import Game from './Game.vue'
import GameRankings from '@/components/GameRankings.vue'
</script>

<style scoped></style>
