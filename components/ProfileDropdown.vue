<script setup>
const router = useRouter()
const { signout } = useAuth()
const message = useState('message')
const loggedInUser = useState('loggedInUser')
const isAuthenticated = useState('isAuthenticated')
// const { errorMsg, message } = useAppState()
const showDropdown = ref(false)

const lougout = async () => {
  showDropdown.value = false
  const response = await signout()
  if (!response) return
  console.log(response)
  loggedInUser.value = ''
  isAuthenticated.value = false
  message.value = 'You are logged out'
}

const goToProfile = () => {
  showDropdown.value = false
  router.push({ name: `auth-profile` })
}
</script>

<template>
  <div class="relative flex items-center text-xs">
    <div
      class="fixed inset-0 w-full h-full opacity-50 bg-slate-900 z-9"
      v-if="showDropdown"
      @click="showDropdown = !showDropdown"
    ></div>
    <div class="z-10">
      <a
        href="#"
        class="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-sm z-30 bg-white hover:(text-slate-700 )"
        :class="{ selected: showDropdown }"
        @click="showDropdown = !showDropdown"
      >
        <IconsUser class="w-4 h-4" />
        <h3 class="font-light uppercase">Welcome {{ loggedInUser }}</h3>
      </a>
      <div
        class="shadow-md flex flex-col gap-4 bg-slate-50 p-2 absolute z-20 text-slate-800 w-full border border-gray-400"
        v-if="showDropdown"
      >
        <h3 class="">My Accoun</h3>
        <ul class="flex flex-col gap-2">
          <li>
            <NuxtLink :to="{ name: `admin` }">Admin Dashboard</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: `admin` }">Order History</NuxtLink>
          </li>
          <li class="cursor-pointer" @click="goToProfile">Personal Information</li>
          <li>
            <NuxtLink :to="{ name: `admin` }">Addresses?</NuxtLink>
          </li>
        </ul>
        <button class="btn btn__secondary py-05 px1" @click="lougout">Sign out</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// @import '@/assets/scss/variables';

// .header {
//   border: 1px solid $slate-600;
//   &:hover,
//   &.selected {
//     border: 1px solid #fff;
//     background-color: #fff;
//     color: $slate-800;
//     border-radius: 3px 3px 0 0;

//     svg {
//       fill: $slate-800;
//     }
//   }
// }

// li {
//   padding: 0.5rem 0;
//   border-top: 1px solid $slate-400;
//   text-transform: capitalize;

//   &:last-child {
//     border-bottom: 1px solid $slate-400;
//   }
// }
</style>
