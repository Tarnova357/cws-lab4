<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Participant, ParticipantFormData } from '@/types/participant'

import WinnersSection from '@/components/winners/WinnersSection.vue'
import RegisterForm from '@/components/participants/RegisterForm.vue'
import ParticipantsTable from '@/components/participants/ParticipantsTable.vue'
import EditParticipantModal from '@/components/participants/EditParticipantModal.vue'
import DeleteConfirmModal from '@/components/participants/DeleteConfirmModal.vue'

const STORAGE_PARTICIPANTS_KEY = 'lottery_participants'
const STORAGE_WINNERS_KEY = 'lottery_winners'

const participants = ref<Participant[]>([])
const winners = ref<Participant[]>([])

const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedParticipant = ref<Participant | null>(null)

onMounted(() => {
  const savedParticipants = localStorage.getItem(STORAGE_PARTICIPANTS_KEY)
  if (savedParticipants) {
    try {
      participants.value = JSON.parse(savedParticipants)
    } catch {
      participants.value = []
    }
  }

  const savedWinners = localStorage.getItem(STORAGE_WINNERS_KEY)
  if (savedWinners) {
    try {
      winners.value = JSON.parse(savedWinners)
    } catch {
      winners.value = []
    }
  }
})

watch(
  participants,
  (newParticipants) => {
    localStorage.setItem(STORAGE_PARTICIPANTS_KEY, JSON.stringify(newParticipants))
  },
  { deep: true },
)

watch(
  winners,
  (newWinners) => {
    localStorage.setItem(STORAGE_WINNERS_KEY, JSON.stringify(newWinners))
  },
  { deep: true },
)

const existingEmails = computed(() => participants.value.map((p) => p.email))

const handleAddParticipant = (formData: ParticipantFormData) => {
  const newParticipant: Participant = {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ...formData,
  }
  participants.value.push(newParticipant)
}

const handlePickWinner = (winner: Participant) => {
  if (winners.value.length < 3) {
    winners.value.push(winner)
  }
}

const handleRemoveWinner = (winnerId: string) => {
  winners.value = winners.value.filter((w) => w.id !== winnerId)
}

const handleOpenEdit = (participant: Participant) => {
  selectedParticipant.value = participant
  isEditModalOpen.value = true
}

const handleUpdateParticipant = (updated: Participant) => {
  const index = participants.value.findIndex((p) => p.id === updated.id)
  if (index !== -1) {
    participants.value[index] = updated

    const winnerIndex = winners.value.findIndex((w) => w.id === updated.id)
    if (winnerIndex !== -1) {
      winners.value[winnerIndex] = updated
    }
  }
}

const handleOpenDelete = (participant: Participant) => {
  selectedParticipant.value = participant
  isDeleteModalOpen.value = true
}

const handleConfirmDelete = () => {
  if (!selectedParticipant.value) return

  const idToDelete = selectedParticipant.value.id

  participants.value = participants.value.filter((p) => p.id !== idToDelete)

  winners.value = winners.value.filter((w) => w.id !== idToDelete)

  isDeleteModalOpen.value = false
  selectedParticipant.value = null
}
</script>

<template>
  <main class="lottery-layout">
    <div class="lottery-container">
      <WinnersSection
        :winners="winners"
        :participants="participants"
        @pick-winner="handlePickWinner"
        @remove-winner="handleRemoveWinner"
      />

      <RegisterForm :existing-emails="existingEmails" @add-participant="handleAddParticipant" />

      <ParticipantsTable
        :participants="participants"
        @edit-participant="handleOpenEdit"
        @delete-participant="handleOpenDelete"
      />
    </div>

    <EditParticipantModal
      :is-open="isEditModalOpen"
      :participant="selectedParticipant"
      :existing-emails="existingEmails"
      @close="isEditModalOpen = false"
      @update-participant="handleUpdateParticipant"
    />

    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :participant="selectedParticipant"
      @close="isDeleteModalOpen = false"
      @confirm-delete="handleConfirmDelete"
    />
  </main>
</template>

<style scoped lang="scss">
.lottery-layout {
  min-height: 100vh;
  background-color: #f4f5f7;
  padding: 3rem 1rem;
}

.lottery-container {
  max-width: 860px;
  margin: 0 auto;
}
</style>
