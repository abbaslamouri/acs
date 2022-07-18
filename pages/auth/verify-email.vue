<script setup>
const router = useRouter()
const route = useRoute()
// const config = useRuntimeConfig()
const { verifyEmail } = useAuth()
const errorMsg = useState('errorMsg')
const message = useState('message')
const loggedInUser = useState('loggedInUser')
const isAuthenticated = useState('isAuthenticated')
// const { errorMsg, message } = useAppState()
const email = ref('abbaslamouri@yrlus.com')

const confirmRegistration = async () => {
  const auth = await verifyEmail({ email: email.value, signupToken: route.query.signupToken })
  if (!auth) return
  loggedInUser.value = auth.userName
  isAuthenticated.value = true
  message.value = 'Registration successfull.  You are now logged in.'
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgotpassword' })
  showAuthForm.value = false
}
</script>

<template>
  <div class="flex-1 bg-slate-900 flex justify-center items-start pt-10 w-screen">
    <form class="bg-slate-50 p-6 br-3 flex flex-col gap-6 w-screen-sm" @submit.prevent="confirmRegistration">
      <h2>Activate your account</h2>
      <div class="bg-red-100 p-2 rounded text-xs flex-col gap-2" v-if="errorMsg">
        <p>{{ errorMsg }}</p>
        <button
          class="btn btn-primary py-05 px-2 text-xs"
          @click.prevent="getNewToken"
          v-if="errorMsg.includes('token')"
        >
          <p>Click Here to get a new token</p>
        </button>
      </div>
      <FormsBaseInput type="email" label="Email" placeholder="Email" v-model="email" :required="true" />
      <button class="btn btn-primary py-2 px-4 self-end text-xs">
        Verity Email<IconsChevronRight class="w-5 h-5 fill-white" />
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped></style>
