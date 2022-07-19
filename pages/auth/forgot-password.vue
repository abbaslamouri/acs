<script setup>
const { forgotPassword } = useAuth()
const errorMsg = useState('errorMsg')
const message = useState('messsage')

const email = ref('abbaslamouri@yrlus.com')

const handleForgotPassword = async () => {
  const response = await forgotPassword({
    email: email.value,
    url: `${window.location.protocol}//${window.location.host}/auth/reset-password`,
    emailSubject: 'Your password reset token (valid for 1 hour)',
  })
  if (response) return (message.value = 'Please check your email for instructions to reset your password.')
  console.log(response)
}
</script>

<template>
  <div class="flex-1 bg-slate-900 flex justify-center items-start pt-10 w-screen">
    <form class="bg-slate-50 p-6 br-3 flex flex-col gap-6 w-screen-sm" @submit.prevent="handleForgotPassword">
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

      <button class="btn btn-primary py-2 px-4 self-end text-xs tracking-wide">
        Reset Password<IconsChevronRight class="fill-white w-5 h-5" />
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
