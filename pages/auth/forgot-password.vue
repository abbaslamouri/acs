<script setup>
const { forgotPassword } = useAuth()
const { message, errorMsg } = useAppState()

const email = ref('abbaslamouri@yrlus.com')

const handleForgotPassword = async () => {
  errorMsg.value = null
  message.value = null
  const response = await forgotPassword({
    email: email.value,
    url: `${window.location.protocol}//${window.location.host}/auth/reset-password`,
    emailSubject: 'Your password reset token (valid for 1 hour)',
  })
  if (response) return (message.value = 'Please check your email for instructions to reset your password.')
}
</script>

<template>
  <div class="h-100vh bg-slate-900 flex-row justify-center items-start pt-10">
    <form class="bg-slate-50 p-4 br-3 flex-col gap-2" @submit.prevent="handleForgotPassword">
      <h2>Forgot you password?</h2>
      <FormsBaseInput
        type="email"
        label="Email Address"
        placeholder="Email Address"
        v-model="email"
        :required="true"
        minlength="8"
        maxlength="25"
      />
      <p class="text-xs">
        We will send you an email with a link to assist you with resetting your password. Check your spam folder for an
        email from: identification@nespresso.com.
      </p>
      <p class="text-sm">If you have questions, please call customer service at 1-800-555-5555.</p>

      <button class="btn btn__primary py-05 px-1 items-self-end">Reset Password<IconsChevronRight /></button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
