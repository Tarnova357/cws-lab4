<script setup lang="ts">
interface Props {
  name: string
}

defineProps<Props>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <span class="winner-badge">
    <span class="badge-text">{{ name }}</span>
    <button
      type="button"
      class="badge-remove-btn"
      aria-label="Remove winner"
      @click="$emit('remove')"
    >
      ×
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: #33a3dc;
  color: #ffffff;
  padding: 0.2rem 0.6rem;
  border-radius: 3px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-text {
  line-height: 1.2;
}

.badge-remove-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.75;
  }
}
</style>
