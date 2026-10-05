<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Participant, SortField, SortDirection } from '@/types/participant'
import SearchBar from './SearchBar.vue'
import AppButton from '@/components/base/AppButton.vue'

interface Props {
  participants: Participant[]
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'edit-participant', participant: Participant): void
  (e: 'delete-participant', participant: Participant): void
}>()

const searchQuery = ref('')
const sortField = ref<SortField>(null)
const sortDirection = ref<SortDirection>('asc')

const handleFilterByName = (query: string) => {
  searchQuery.value = query
}

const handleSort = (field: 'name' | 'dateOfBirth') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const processedParticipants = computed(() => {
  // 1. Фільтрація за іменем
  let result = props.participants.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  // 2. Сортування відфільтрованих даних
  if (sortField.value) {
    const currentField = sortField.value
    const directionMultiplier = sortDirection.value === 'asc' ? 1 : -1

    result = [...result].sort((a, b) => {
      if (currentField === 'name') {
        return a.name.localeCompare(b.name) * directionMultiplier
      }
      if (currentField === 'dateOfBirth') {
        const dateA = new Date(a.dateOfBirth).getTime()
        const dateB = new Date(b.dateOfBirth).getTime()
        return (dateA - dateB) * directionMultiplier
      }
      return 0
    })
  }

  return result
})
</script>

<template>
  <div class="lottery-card table-card">
    <SearchBar @filter-by-name="handleFilterByName" />

    <div class="table-responsive">
      <table class="table custom-table align-middle">
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="sortable-header" @click="handleSort('name')">
              Name
              <span class="sort-icon">
                <template v-if="sortField === 'name'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </template>
                <template v-else>⇅</template>
              </span>
            </th>
            <th class="sortable-header" @click="handleSort('dateOfBirth')">
              Date of Birth
              <span class="sort-icon">
                <template v-if="sortField === 'dateOfBirth'">
                  {{ sortDirection === 'asc' ? '▲' : '▼' }}
                </template>
                <template v-else>⇅</template>
              </span>
            </th>
            <th>Email</th>
            <th>Phone number</th>
            <th class="text-center">Редагування</th>
            <th class="text-center">Видалення</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="processedParticipants.length === 0">
            <td colspan="7" class="text-center py-4 text-muted">Учасників не знайдено</td>
          </tr>
          <tr v-for="(participant, index) in processedParticipants" v-else :key="participant.id">
            <td class="col-num">{{ index + 1 }}</td>
            <td class="fw-semibold">{{ participant.name }}</td>
            <td>{{ participant.dateOfBirth }}</td>
            <td>{{ participant.email }}</td>
            <td>{{ participant.phoneNumber }}</td>
            <td class="text-center">
              <AppButton
                variant="primary"
                class="btn-action"
                @click="$emit('edit-participant', participant)"
              >
                Редагувати дані
              </AppButton>
            </td>
            <td class="text-center">
              <AppButton
                variant="danger"
                class="btn-action"
                @click="$emit('delete-participant', participant)"
              >
                Видалити учасника
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-card {
  padding: 1.5rem;
}

.custom-table {
  margin-bottom: 0;

  thead th {
    font-size: 0.9rem;
    font-weight: 700;
    color: #495057;
    border-bottom: 2px solid #e9ecef;
    padding: 0.75rem 0.6rem;
    white-space: nowrap;
  }

  tbody td {
    font-size: 0.9rem;
    color: #495057;
    border-bottom: 1px solid #f1f3f5;
    padding: 0.75rem 0.6rem;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
}

.col-num {
  color: #adb5bd;
  width: 40px;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease;

  &:hover {
    color: #33a3dc;
  }
}

.sort-icon {
  display: inline-block;
  margin-left: 0.35rem;
  font-size: 0.8rem;
  color: #8c98a4;
}

.btn-action {
  padding: 0.25rem 0.65rem;
  font-size: 0.82rem;
}
</style>
