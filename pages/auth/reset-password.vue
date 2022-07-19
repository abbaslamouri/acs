<script setup>
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const { resetPassword } = useAuth()
// const { message, errorMsg } = useAppState()
const errorMsg = useState('errorMsg')
const message = useState('messsage')

const password = ref('adrar0714')
const passwordConfirm = ref('adrar0714')

const handleResetPassword = async () => {
  if (password.value !== passwordConfirm.value)
    return (errorMsg.value = "Your password and confirmation password don't match")
  const data = await resetPassword({ password: password.value, resetToken: route.query.resetToken })
  console.log(data)
  if (!data) return
  // (errorMsg.value = 'password reset  failed, please try again later')
  // const auth = useCookie('auth', {
  //   expires: new Date(Date.now() + config.COOKIE_EXPIRES_IN * 24 * 3600 * 1000),
  //   path: '/',
  // })
  // auth.value = data.auth
  // user.value = data.user
  // resetToken.value = data.resetToken
  // isAuthenticated.value = true
  // router.push({ name: 'ecommerce-products' })
  message.value = 'Password reset successfull, you are now logged in.'
}
</script>

<template>
  <main class="flex-1 bg-slate-900 flex justify-center items-start pt-10 w-screen">
    <form class="bg-slate-50 p-6 br-3 flex flex-col gap-6 w-screen-sm" @submit.prevent="handleResetPassword">
      <h2>Reset Password</h2>
      <div class="bg-red-100 p-2 br-3 text-xs flex-col gap-2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
      </div>
      <FormsBaseInput
        type="password"
        label="Password"
        placeholder="Password"
        v-model="password"
        :required="true"
        minlength="8"
        maxlength="25"
      />
      <FormsBaseInput
        type="password"
        label="Confirm Password"
        placeholder="Confirm Password"
        v-model="passwordConfirm"
        :required="true"
        minlength="8"
        maxlength="25"
      />
      <button class="btn btn-primary py-2 px-4 self-end text-xs tracking-wide">
        Reset Password<IconsChevronRight class="fill-white w-5 h-5" />
      </button>
    </form>
  </main>
</template>

<style lang="scss" scoped></style>
