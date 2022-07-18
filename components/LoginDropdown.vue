<script setup lang="">
defineProps({
  theme: {
    type: String,
  },
})
const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()
const { signin } = useAuth()
const loggedInUser = useState('loggedInUser')
const isAuthenticated = useState('isAuthenticated')
const errorMsg = useState('errorMsg')
const message = useState('message')
// const { errorMsg, message } = useAppState()
const showAuthDropdown = ref(false)
const user = reactive({
  email: '',
  password: '',
})

const signup = async () => {
  router.push({ name: 'auth-signup', query: { redirect: route.name } })
  showAuthDropdown.value = false
}

const login = async () => {
  showAuthDropdown.value = false
  const auth = await signin(user)
  if (!auth) return
  loggedInUser.value = auth.userName
  isAuthenticated.value = true
  message.value = 'Login succssful'
}

const forgotPassword = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthDropdown.value = false
}
</script>

<template>
  <div class="relative flex items-center text-xs">
    <div
      class="fixed inset-0 w-full h-full opacity-50 bg-slate-900 z-9"
      v-if="showAuthDropdown"
      @click="showAuthDropdown = !showAuthDropdown"
    ></div>
    <div class="z-10">
      <a
        href="#"
        class="header flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-sm z-30 hover:(bg-white text-slate-900 )"
        :class="{ selected: showAuthDropdown }"
        @click="showAuthDropdown = !showAuthDropdown"
      >
        <IconsUser class="w-4 h-4" />
        <h3 class="font-light uppercase">Sign in / Create acount</h3>
      </a>
      <form class="shadow-md flex flex-col gap-4 bg-slate-50 p-2 absolute z-20 text-slate-800" v-if="showAuthDropdown">
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
  </div>
</template>

<style lang="scss" scoped>
.header {
  &.dark {
    color: red;
  }
  &:hover,
  &.selected {
    background-color: white;
    color: #0f172a;
    border-bottom: transparent;
    border-radius: 0.125rem 0.125rem 0 0;
    svg {
      fill: #0f172a;
    }
  }
}
</style>
