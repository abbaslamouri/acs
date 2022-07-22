<script setup>
const router = useRouter()
const route = useRoute()
console.log('RR', route.params)
// const config = useRuntimeConfig()
const { fetchLoggedInUser, updateLoggedInUserInfo, updateLoggedInUserPwd } = useAuth()
const errorMsg = useState('errorMsg')
const message = useState('message')
const loggedInUser = useState('loggedInUser')
const isAuthenticated = useState('isAuthenticated')
// const { errorMsg, message } = useAppState()
const content = ref('personal-information')
// const email = ref('')
const confirmEmail = ref('')
const currentPassword = ref('adrar0714')
const newPassword = ref('adrar0715')
const confirmNewPassword = ref('adrar0715')
const user = ref({})

onMounted(async () => {
  const response = await fetchLoggedInUser()
  console.log('U', response)
  if (response) user.value = response
  confirmEmail.value = user.value.email
})

const updateLoggedInUserInformation = async () => {
  if (user.value.email !== confirmEmail.value) return (errorMsg.value = "Email and confirmation email don't match")
  const response = await updateLoggedInUserInfo({ email: user.value.email, name: user.value.name })
  console.log('U', response)
}

const updateLoggedInUserPassword = async () => {
  if (newPassword.value !== confirmNewPassword.value)
    return (errorMsg.value = "Password and confirmation [password] don't match")
  const response = await updateLoggedInUserPwd({ currentPassword:currentPassword.value, newPassword: newPassword.value })
  console.log('U', response)
  // if (response) user.value = response
}

const getNewToken = async () => {
  router.push({ name: 'auth-forgotpassword' })
  showAuthForm.value = false
}
</script>

<template>
  <div class="flex-1 p-4 w-screen border-5 border-red-300">
    <div class="container mx-auto" v-if="Object.values(user).length">
      <div class="flex gap-4">
        <div class="w-80 border">
          <h2 class="text-xl font-bold">My account</h2>
          <div class="text-xs font-bold flex flex-col gap-1 mt-4">
            <p>Welcome {{ loggedInUser }}</p>
            <p>Member since {{ new Date(user.signupDate).toLocaleDateString() }}</p>
            <p>Membership Number: {{ user.accountNumber }}</p>
          </div>
          <ul class="text-xs mt-4 flex flex-col divide-y divide-gray-400 border-1 border-gray-400">
            <li class="flex gap-2 py-4 px-2 cursor-pointer" @click="content = 'personal-information'">
              <!-- <NuxtLink :to="{ name: `auth-profile`, params: { tab: 'personal-information' } }"
                >Personal Information</NuxtLink
              > -->
              <IconsUser class="w-4 h-4" />
              <span>Personal Information</span>
            </li>
            <li class="flex gap-2 py-4 px-2 cursor-pointer" @click="content = 'order-history'">
              <!-- <NuxtLink :to="{ name: `auth-profile`, params: { tab: 'order-history' } }">Order History</NuxtLink> -->
              <IconsUser class="w-4 h-4" />
              <span>Order History</span>
            </li>
            <li class="flex gap-2 py-4 px-2 cursor-pointer" @click="content = 'Other'">
              <IconsUser class="w-4 h-4" />
              <span>Other</span>
            </li>
          </ul>
        </div>
        <div>
          <div v-if="content === 'personal-information'">
            <div class="border-b-2 border-b-gray-400 p-4">
              <h2>My personal information</h2>
              <div class="mt-4 flex flex-col">
                <p class="">Fill in the form below to update your personal information.</p>
                <div class="flex flex-col gap-6 mt-4">
                  <FormsBaseInput type="text" label="Name" v-model="user.name" :required="true" />
                  <FormsBaseInput type="email" label="Email" v-model="user.email" :required="true" />
                  <FormsBaseInput type="email" label="Confirm Email" v-model="confirmEmail" :required="true" />
                </div>
                <button class="mt-6 btn btn-primary py-2 px-4 self-end text-xs" @click="updateLoggedInUserInformation">
                  Save<IconsChevronRight class="w-5 h-5 fill-white" />
                </button>
              </div>
            </div>
            <div class="border-b-2 border-b-gray-400 p-4">
              <h2 class="text-xl fonrt-bold">Change Password</h2>
              <div class="mt-4 flex flex-col">
                <div class="flex flex-col gap-6">
                  <FormsBaseInput type="password" label="Current Password" v-model="currentPassword" :required="true" />
                  <FormsBaseInput type="password" label="New Password" v-model="newPassword" :required="true" />
                  <FormsBaseInput
                    type="password"
                    label="Confirm New Password"
                    v-model="confirmNewPassword"
                    :required="true"
                  />
                </div>
                <button class="mt-6 btn btn-primary py-2 px-4 self-end text-xs" @click="updateLoggedInUserPassword">
                  Save<IconsChevronRight class="w-5 h-5 fill-white" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="content === 'order-history'">
            <h2>Order History</h2>
            <!-- <p>Fill in the form below to update your personal information.</p>
            <FormsBaseInput type="email" label="Email" placeholder="Email" v-model="email" :required="true" />
            <button class="btn btn-primary py-2 px-4 self-end text-xs">
              Verity Email<IconsChevronRight class="w-5 h-5 fill-white" />
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
