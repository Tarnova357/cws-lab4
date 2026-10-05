<script setup lang="ts">
import type { Participant } from '@/types/participant'
import AppModal from '@/components/base/AppModal.vue'
import AppButton from '@/components/base/AppButton.vue'

interface Props {
  isOpen: boolean
  participant: Participant | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm-delete'): void
}>()
</script>

<template>
  <AppModal :is-open="isOpen" title="Підтвердження видалення" @close="emit('close')">
    <p v-if="participant" class="confirmation-text">
      Ви дійсно бажаєте видалити учасника
      <strong>"{{ participant.name }}"</strong>, <strong>"{{ participant.email }}"</strong>?
    </p>

    <template #footer>
      <AppButton variant="secondary" @click="emit('close')">Ні</AppButton>
      <AppButton variant="danger" @click="emit('confirm-delete')">Так</AppButton>
    </template>
  </AppModal>
</template>

<style scoped lang="scss">
.confirmation-text {
  margin: 0;
  font-size: 1rem;
  color: #333333;
  line-height: 1.5;
}
</style>
