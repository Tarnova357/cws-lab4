<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop-custom" @click.self="emit('close')">
      <div class="modal-dialog-custom" role="dialog" aria-modal="true">
        <div v-if="title || $slots.header" class="modal-header-custom">
          <slot name="header">
            <h5 class="modal-title-custom">{{ title }}</h5>
          </slot>
          <button type="button" class="btn-close-custom" aria-label="Close" @click="emit('close')">
            ×
          </button>
        </div>

        <div class="modal-body-custom">
          <slot />
        </div>

        <div v-if="$slots.footer" class="modal-footer-custom">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-dialog-custom {
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
}

.modal-header-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-title-custom {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #212529;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #000000;
  }
}

.modal-body-custom {
  padding: 1.5rem;
}

.modal-footer-custom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background-color: #fafbfc;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;

  .modal-dialog-custom {
    transition: transform 0.2s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-dialog-custom {
    transform: scale(0.95);
  }
}
</style>
