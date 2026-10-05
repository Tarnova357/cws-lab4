<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import type { Participant } from '@/types/participant'
import AppModal from '@/components/base/AppModal.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppButton from '@/components/base/AppButton.vue'

interface Props {
  isOpen: boolean
  participant: Participant | null
  existingEmails: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update-participant', updated: Participant): void
}>()

const formData = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
})

const errors = reactive({
  name: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
})

const isSubmitted = ref(false)

watch(
  () => props.participant,
  (val) => {
    if (val) {
      formData.name = val.name
      formData.dateOfBirth = val.dateOfBirth
      formData.email = val.email
      formData.phoneNumber = val.phoneNumber
    }
    errors.name = ''
    errors.dateOfBirth = ''
    errors.email = ''
    errors.phoneNumber = ''
    isSubmitted.value = false
  },
  { immediate: true },
)

const validateName = (): boolean => {
  if (!formData.name.trim()) {
    errors.name = 'This value is required.'
    return false
  }
  errors.name = ''
  return true
}

const validateDateOfBirth = (): boolean => {
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'This value is required.'
    return false
  }

  const selectedDate = new Date(formData.dateOfBirth)
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  if (selectedDate > today) {
    errors.dateOfBirth = 'Date of birth cannot be in the future.'
    return false
  }

  errors.dateOfBirth = ''
  return true
}

const validateEmail = (): boolean => {
  const trimmed = formData.email.trim()
  if (!trimmed) {
    errors.email = 'This value is required.'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    errors.email = 'Please enter a valid email address.'
    return false
  }

  const normalized = trimmed.toLowerCase()
  const originalEmail = props.participant?.email.toLowerCase()

  const isDuplicate = props.existingEmails.some(
    (item) => item.toLowerCase() === normalized && normalized !== originalEmail,
  )

  if (isDuplicate) {
    errors.email = 'Participant with this email already exists.'
    return false
  }

  errors.email = ''
  return true
}

const validatePhoneNumber = (): boolean => {
  const trimmed = formData.phoneNumber.trim()
  if (!trimmed) {
    errors.phoneNumber = 'This value is required.'
    return false
  }

  const phoneRegex = /^\+380\d{9}$/
  if (!phoneRegex.test(trimmed)) {
    errors.phoneNumber = 'Phone must be in format +380XXXXXXXXX.'
    return false
  }

  errors.phoneNumber = ''
  return true
}

const handleSubmit = () => {
  isSubmitted.value = true

  const isNameValid = validateName()
  const isDobValid = validateDateOfBirth()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhoneNumber()

  if (isNameValid && isDobValid && isEmailValid && isPhoneValid && props.participant) {
    emit('update-participant', {
      id: props.participant.id,
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth,
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    })
    emit('close')
  }
}
</script>

<template>
  <AppModal :is-open="isOpen" title="Редагувати дані учасника" @close="emit('close')">
    <form @submit.prevent="handleSubmit">
      <AppInput
        id="edit-name"
        v-model="formData.name"
        label="Name"
        :error="errors.name"
        :is-valid="!errors.name && !!formData.name.trim()"
      />

      <AppInput
        id="edit-dob"
        v-model="formData.dateOfBirth"
        type="date"
        label="Date of Birth"
        :error="errors.dateOfBirth"
        :is-valid="!errors.dateOfBirth && !!formData.dateOfBirth"
      />

      <AppInput
        id="edit-email"
        v-model="formData.email"
        type="email"
        label="Email"
        :error="errors.email"
        :is-valid="!errors.email && !!formData.email.trim()"
      />

      <AppInput
        id="edit-phone"
        v-model="formData.phoneNumber"
        type="tel"
        label="Phone number"
        :error="errors.phoneNumber"
        :is-valid="!errors.phoneNumber && !!formData.phoneNumber.trim()"
      />
    </form>

    <template #footer>
      <AppButton variant="secondary" @click="emit('close')">Скасувати</AppButton>
      <AppButton variant="primary" @click="handleSubmit">Оновити дані</AppButton>
    </template>
  </AppModal>
</template>
