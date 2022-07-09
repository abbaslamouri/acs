<script setup lang="">
const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()
// const { loggedInUser, token, isAuthenticated, signin } = useAuth()
// const { errorMsg, message } = useAppState()
const showAuthDropdown = ref(false)
const formUser = reactive({
  email: '',
  password: '',
})

const signup = async () => {
  // if (user.password !== user.passwordConfirm)
  // 	return (errorMsg.value = "Your password and confirmation password don't match")
  // const response = await signup(user)
  // console.log(response)
  // if (!response) return
  // const customer = response.user
  // cart.value.customer = customer
  // cart.value.name = customer.name
  // cart.value.email = customer.email
  // cart.value.billingAddress = customer.billingAddress
  // const cartShippingAddress = customer.shippingAddresses.find((a) => a.isDefault)
  // if (cartShippingAddress) cart.value.shippingAddress = cartShippingAddress
  // else cart.value.shippingAddress = customer.shippingAddresses[0]
  // const cartPhoneNumber = customer.phoneNumbers.find((p) => p.isDefault)
  // if (cartPhoneNumber) cart.value.phoneNumber = cartPhoneNumber
  // else cart.value.phoneNumber = customer.phoneNumbers[0]

  // console.log(cart.value)

  // router.push({ name: 'ecommerce-shipping' })
  router.push({ name: 'auth-signup', query: { redirect: route.name } })
  showAuthDropdown.value = false
}

const login = async () => {
  showAuthDropdown.value = false
  await signin(formUser)
}

const forgotPassword = async () => {
  router.push({ name: 'auth-forgot-password' })
  showAuthDropdown.value = false
}
</script>

<template>
  <div class="relative flex items-center text-white">
    <div
      class="fixed inset-0 w-full h-full opacity-50 bg-slate-900 z-9"
      v-if="showAuthDropdown"
      @click="showAuthDropdown = !showAuthDropdown"
    ></div>
    <div class="z-10">
      <a
        href="#"
        class="header flex flex-row items-center gap-2 px-4 py-2 border rounded-sm z-30 hover:(bg-white text-slate-900 )"
        :class="{ selected: showAuthDropdown }"
        @click="showAuthDropdown = !showAuthDropdown"
      >
        <IconsUser class="w-4 h-4 fill-white" />
        <h3 class="font-light uppercase">Sign in / Create acount</h3>
      </a>
      <form class="shadow-md flex flex-col gap-4 bg-slate-50 p-2 absolute z-20 text-slate-800" v-if="showAuthDropdown">
        <h3 class="title">Sin in</h3>
        <p class="text-xs">Access your account and place an order:</p>
        <div class="flex flex-col gap-4">
          <FormsBaseInput label="Email" type="email" v-model="formUser.email" :required="true" />
          <FormsBaseInput label="Password" type="password" v-model="formUser.password" :required="true" />
        </div>
        <div>
          <button class="btn btn-link w-full text-sm" @click.prevent="forgotPassword">
            <p>Forgot Password?</p>
          </button>
        </div>
        <button class="btn btn-secondary w-full flex-row justify-between text-xs" @click.prevent="login">
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
