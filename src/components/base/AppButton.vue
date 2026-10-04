<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['btn', `btn-${variant}`, 'app-button']"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.app-button {
  font-weight: 500;
  padding: 0.45rem 1.5rem;
  border-radius: 4px;
  font-size: 0.95rem;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &.btn-primary {
    background-color: #33a3dc;
    border-color: #33a3dc;
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: #2792c7;
      border-color: #2792c7;
    }

    &:disabled {
      background-color: #8ed0f0;
      border-color: #8ed0f0;
      cursor: not-allowed;
      opacity: 0.8;
    }
  }

  &.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: #bb2d3b;
      border-color: #bb2d3b;
    }
  }

  &.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
    color: #ffffff;

    &:hover:not(:disabled) {
      background-color: #5c636a;
      border-color: #5c636a;
    }
  }
}
</style>
