<script setup lang="ts">
import { computed } from 'vue'
import type { Participant } from '@/types/participant.ts'
import AppButton from '../base/AppButton.vue'
import WinnerBadge from './WinnerBadge.vue'

interface Props {
  winners: Participant[]
  participants: Participant[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'pick-winner', winner: Participant): void
  (e: 'remove-winner', winnerId: string): void
}>()

const availableCandidates = computed(() => {
  const winnerIds = new Set(props.winners.map((w) => w.id))
  return props.participants.filter((p) => !winnerIds.has(p.id))
})

const isNewWinnerDisabled = computed(() => {
  return (
    props.winners.length >= 3 ||
    props.participants.length === 0 ||
    availableCandidates.value.length === 0
  )
})

const handlePickWinner = () => {
  if (isNewWinnerDisabled.value) return

  const candidates = availableCandidates.value
  const randomIndex = Math.floor(Math.random() * candidates.length)
  const selectedWinner = candidates[randomIndex]
  if (selectedWinner) {
    emit('pick-winner', selectedWinner)
  }
}
</script>

<template>
  <div class="lottery-card winners-card">
    <div class="winners-container">
      <div class="winners-display-area">
        <template v-if="winners.length > 0">
          <WinnerBadge
            v-for="winner in winners"
            :key="winner.id"
            :name="winner.name"
            @remove="$emit('remove-winner', winner.id)"
          />
        </template>
        <span v-else class="winners-placeholder">Winners</span>
      </div>

      <AppButton variant="primary" :disabled="isNewWinnerDisabled" @click="handlePickWinner">
        New winner
      </AppButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.winners-card {
  padding: 1.25rem 1.5rem;
}

.winners-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.winners-display-area {
  flex: 1;
  min-height: 42px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 0.35rem 0.65rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.winners-placeholder {
  color: #adb5bd;
  font-size: 0.95rem;
}
</style>
