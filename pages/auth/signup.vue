<script setup>
const title = ref('Products | YRL')
const router = useRouter()
const { signup } = useAuth()
const errorMsg = useState('errorMsg')
const message = useState('message')
const user = reactive({
  name: 'Abbas Lamouri',
  email: 'abbaslamouri@yrlus.com',
  password: 'adrar0714',
  passwordConfirm: 'adrar0714',
})
const loading = ref(false)

const register = async () => {
  if (user.password !== user.passwordConfirm)
    return (errorMsg.value = "Your password and confirmation password don't match")
  loading.value = true
  const response = await signup({
    user,
    url: `${window.location.protocol}//${window.location.host}/auth/verify-email`,
  })
  loading.value = false
  if (!response) return
  router.push({ name: 'index' })
  message.value = 'Thank you for signing up.  Pleaase check your email to verify your account'
}
</script>

<template>
  <div class="h-100vh flex-1 bg-slate-700 flex justify-center items-start pt-10">
    <Title>{{ title }}</Title>
    <div class="bg-slate-50 p-4 rounded flex gap-4 w-screen-md">
      <div class="flex flex-col gap-2 w-80">
        <h2>Ready to try YRL</h2>
        <div class="flex items-center gap-2 text-sm">
          <IconsCheck class="w-2 h-2 bg-slate-400 br-50per p-02 fill-slate-50" />
          <span>Forever free</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <IconsCheck class="w-2 h-2 bg-slate-400 br-50per p-02 fill-slate-50" />
          <span>No Credit card required</span>
        </div>
      </div>
      <AdminSignupForm :user="user" @updateUser="user = $event" @register="register" />
    </div>
    <Spinner v-if="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
