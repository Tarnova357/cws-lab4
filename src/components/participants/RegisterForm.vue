<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ParticipantFormData } from '@/types/participant'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'

interface Props {
  existingEmails: string[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'add-participant', data: ParticipantFormData): void
}>()

const formData = reactive<ParticipantFormData>({
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

const touched = reactive({
  name: false,
  dateOfBirth: false,
  email: false,
  phoneNumber: false,
})

const isSubmitted = ref(false)

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
  const trimmedEmail = formData.email.trim()
  if (!trimmedEmail) {
    errors.email = 'This value is required.'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.'
    return false
  }

  const normalizedEmail = trimmedEmail.toLowerCase()
  const isDuplicate = props.existingEmails.some((item) => item.toLowerCase() === normalizedEmail)

  if (isDuplicate) {
    errors.email = 'Participant with this email already exists.'
    return false
  }

  errors.email = ''
  return true
}

const validatePhoneNumber = (): boolean => {
  const trimmedPhone = formData.phoneNumber.trim()
  if (!trimmedPhone) {
    errors.phoneNumber = 'This value is required.'
    return false
  }

  const phoneRegex = /^\+380\d{9}$/
  if (!phoneRegex.test(trimmedPhone)) {
    errors.phoneNumber = 'Phone must be in format +380XXXXXXXXX.'
    return false
  }

  errors.phoneNumber = ''
  return true
}

const handleBlur = (field: keyof typeof touched) => {
  touched[field] = true
  if (field === 'name') validateName()
  if (field === 'dateOfBirth') validateDateOfBirth()
  if (field === 'email') validateEmail()
  if (field === 'phoneNumber') validatePhoneNumber()
}

const resetForm = () => {
  formData.name = ''
  formData.dateOfBirth = ''
  formData.email = ''
  formData.phoneNumber = ''

  errors.name = ''
  errors.dateOfBirth = ''
  errors.email = ''
  errors.phoneNumber = ''

  touched.name = false
  touched.dateOfBirth = false
  touched.email = false
  touched.phoneNumber = false

  isSubmitted.value = false
}

const handleSubmit = () => {
  isSubmitted.value = true

  const isNameValid = validateName()
  const isDobValid = validateDateOfBirth()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhoneNumber()

  if (isNameValid && isDobValid && isEmailValid && isPhoneValid) {
    emit('add-participant', {
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth,
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    })
    resetForm()
  }
}
</script>

<template>
  <div class="lottery-card register-card">
    <h2 class="form-title">REGISTER FORM</h2>
    <p class="form-subtitle">Please fill in all the fields.</p>

    <form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
      <AppInput
        id="name"
        v-model="formData.name"
        label="Name"
        placeholder="Enter user name"
        :error="errors.name"
        :is-valid="!errors.name && !!formData.name.trim() && (touched.name || isSubmitted)"
        @blur="handleBlur('name')"
      />

      <AppInput
        id="dateOfBirth"
        v-model="formData.dateOfBirth"
        type="date"
        label="Date of Birth"
        placeholder="mm/dd/yyyy"
        :error="errors.dateOfBirth"
        :is-valid="
          !errors.dateOfBirth && !!formData.dateOfBirth && (touched.dateOfBirth || isSubmitted)
        "
        @blur="handleBlur('dateOfBirth')"
      />

      <AppInput
        id="email"
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error="errors.email"
        :is-valid="!errors.email && !!formData.email.trim() && (touched.email || isSubmitted)"
        @blur="handleBlur('email')"
      />

      <AppInput
        id="phoneNumber"
        v-model="formData.phoneNumber"
        type="tel"
        label="Phone number"
        placeholder="+380XXXXXXXXX"
        :error="errors.phoneNumber"
        :is-valid="
          !errors.phoneNumber &&
          !!formData.phoneNumber.trim() &&
          (touched.phoneNumber || isSubmitted)
        "
        @blur="handleBlur('phoneNumber')"
      />

      <div class="form-actions">
        <AppButton type="submit">Save</AppButton>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.register-card {
  text-align: left;
}

.form-title {
  font-size: 1.1rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #1a202c;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}

.form-subtitle {
  font-size: 0.95rem;
  color: #8c98a4;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
}
</style>
