<script setup lang="ts">
interface Props {
  modelValue: string
  id?: string
  label?: string
  type?: string
  placeholder?: string
  error?: string | null
  isValid?: boolean
}

withDefaults(defineProps<Props>(), {
  id: '',
  label: '',
  type: 'text',
  placeholder: '',
  error: null,
  isValid: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-input-group">
    <label v-if="label" :for="id" class="app-input-label">
      {{ label }}
    </label>

    <div class="input-wrapper">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="[
          'form-control',
          'app-input',
          { 'is-valid-custom': isValid && !error },
          { 'is-invalid-custom': !!error },
        ]"
        @input="handleInput"
        @blur="$emit('blur')"
        @keydown="$emit('keydown', $event)"
      />
      <span v-if="isValid && !error" class="valid-check" aria-hidden="true">✓</span>
    </div>

    <p v-if="error" class="error-message">
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.app-input-group {
  margin-bottom: 1.1rem;
  text-align: left;
}

.app-input-label {
  display: block;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.35rem;
  font-size: 0.95rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.app-input {
  background-color: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
  color: #495057;
  width: 100%;
  box-shadow: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    background-color: #ffffff;
    border-color: #33a3dc;
    outline: none;
    box-shadow: none;
  }

  &.is-valid-custom {
    border-color: #20c997;
    padding-right: 2.2rem;
  }

  &.is-invalid-custom {
    border-color: #dc3545;
  }
}

.valid-check {
  position: absolute;
  right: 0.85rem;
  color: #198754;
  font-weight: bold;
  font-size: 1.15rem;
  pointer-events: none;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.35rem;
  margin-bottom: 0;
}
</style>
