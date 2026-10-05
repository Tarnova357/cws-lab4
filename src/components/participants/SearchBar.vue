<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void
}>()

const searchQuery = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchQuery, (newVal) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    emit('filter-by-name', newVal.trim())
  }, 300)
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="search-bar-wrapper">
    <input
      v-model="searchQuery"
      type="text"
      class="form-control search-input"
      placeholder="Search participants by name..."
    />
  </div>
</template>

<style scoped lang="scss">
.search-bar-wrapper {
  margin-bottom: 1.25rem;
}

.search-input {
  background-color: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem 0.85rem;
  font-size: 0.95rem;

  &:focus {
    background-color: #ffffff;
    border-color: #33a3dc;
    box-shadow: none;
  }
}
</style>
