<script setup lang="">
defineProps({
  theme: {
    type: String,
  },
})
const router = useRouter()
const route = useRoute()
const { signin } = useAuth()
const loggedInUser = useState('loggedInUser')
const isAuthenticated = useState('isAuthenticated')
const message = useState('message')
const showDropdown = ref(false)
const user = reactive({
  email: '',
  password: '',
})
const loading = ref(false)

const signup = async () => {
  router.push({ name: 'auth-signup', query: { redirect: route.name } })
  showDropdown.value = false
}

const login = async () => {
  showDropdown.value = false
  loading.value = true
  const auth = await signin(user)
  loading.value = false
  if (!auth) return
  loggedInUser.value = auth.userName
  isAuthenticated.value = true
  message.value = 'Login succssful'
}

const forgotPassword = async () => {
  router.push({ name: 'auth-forgot-password' })
  showDropdown.value = false
}
</script>

<template>
  <div class="relative flex items-center text-xs min-w-60 border border-gray-400 rounded">
    <div
      class="fixed inset-0 w-full h-full opacity-50 bg-slate-900 z-9"
      v-if="showDropdown"
      @click="showDropdown = !showDropdown"
    ></div>
    <div class="z-10 w-full">
      <a
        href="#"
        class="flex items-center gap-2 px-4 py-2 rounded-sm z-20 bg-white hover:( text-slate-700 )"
        :class="{ selected: showDropdown }"
        @click="showDropdown = !showDropdown"
      >
        <IconsUser class="w-4 h-4" />
        <h3 class="font-light uppercase">Sign in / Create acount</h3>
      </a>
      <form
        class="shadow-md flex flex-col gap-4 bg-slate-50 p-2 absolute z-20 text-slate-800 w-full"
        v-if="showDropdown"
      >
        <h3 class="title">Sin in</h3>
        <p class="text-xs">Access your account and place an order:</p>
        <div class="flex flex-col gap-4">
          <FormsBaseInput label="Email" type="email" v-model="user.email" :required="true" />
          <FormsBaseInput label="Password" type="password" v-model="user.password" :required="true" />
        </div>
        <div>
          <button class="btn btn-link w-full text-sm" @click.prevent="forgotPassword">
            <p>Forgot Password?</p>
          </button>
        </div>
        <button class="btn btn-secondary w-fullflex justify-between text-xs" @click.prevent="login">
          <p>Sign in</p>
          <IconsArrowEast />
        </button>
        <div>
          <p class="text-sm mt-2">New User?</p>
          <button class="btn btn-secondary w-full justify-between text-xs mt-1" @click.prevent="signup">
            <p>Create an account</p>
            <IconsArrowEast />
          </button>
        </div>
      </form>
    </div>
    <Spinner v-if="loading" />
  </div>
</template>

<style lang="scss" scoped></style>
