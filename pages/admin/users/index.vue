<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Users | YRL')

// const config = useRuntimeConfig()
// const { errorMsg, message } = useAppState()
const { fetchAll } = useHttp()

const users = ref([])
const totalCount = ref(0) // Total item count in the database
const count = ref(0) // item count taking into account params
const page = ref(1)
const perPage = ref(25)
const keyword = ref('')
const sort = reactive({
  field: 'name',
  order: '',
})

let response = null
const sortOptions = [
  { key: 'sortOrder', name: 'Order' },
  { key: 'name', name: 'Name' },
]

const params = computed(() => {
  return {
    match: '',
    project: 'name, email, sortOrder',
    lookup: 'media',
    page: page.value,
    limit: perPage.value,
    sort: `${sort.order}${sort.field}`,
    keyword: keyword.value ? keyword.value : '',
  }
})

const pages = computed(() => {
  return totalCount.value % perPage.value
    ? parseInt(totalCount.value / perPage.value) + 1
    : parseInt(totalCount.value / perPage.value)
})

const fetchAllUsers = async () => {
  response = await fetchAll('users', params.value)
  console.log(response)
  if (!response) return
  users.value = response.docs
  count.value = response.count
  totalCount.value = response.totalCount
}
// const totalCount = ref(0) // Total item count in the database
// const count = ref(null) // item count taking into account params
// const page = ref(1)
// const perPage = ref(10)
// const fields = '-updatedAt'
// const keyword = ref('')
// const sort = reactive({
//   field: 'createdAt',
//   order: '',
// })

// let response
// const sortOptions = [
//   { key: 'sortOrder', name: 'Order' },
//   { key: 'name', name: 'Name' },
//   { key: 'createdAt', name: 'Date Created' },
// ]

// const params = computed(() => {
//   const params = {
//     fields,
//     page: page.value,
//     limit: perPage.value,
//     sort: `${sort.order}${sort.field}, _id `,
//     keyword: keyword.value ? keyword.value : null,
//   }
//   if (!keyword.value) delete params.keyword
//   return params
// })

// const pages = computed(() => {
//   return totalCount.value % perPage.value
//     ? parseInt(totalCount.value / perPage.value) + 1
//     : parseInt(totalCount.value / perPage.value)
// })

const handleSearch = async (searchKeyword) => {
  keyword.value = searchKeyword
  page.value = 1
  await fetchAllUsers()
}

const toggleSort = async (event) => {
  sort.field = event.field
  sort.order = event.order
  await fetchAllUsers()
}

// const setPage = async (currentPage) => {
//   page.value = currentPage
//   await fetchAllUsers()
// }

const setPerPage = async () => {
  await fetchAllUsers()
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  const selectedUser = users.value.find((u) => u.id == userId)
  console.log(selectedUser.userAddresses)
  if (!selectedUser) return
  await Promise.all(
    selectedUser.userAddresses.map(async (userAddressId) => {
      response = await fetchDoc('useraddresses', userAddressId)
      console.log('UA', response)
      if (!response || !Object.values(response).length) return
      const userAddress = response.doc
      await Promise.all(
        userAddress.phoneNumbers.map(async (phoneNumber) => {
          const deletedPhoneNumber = await deleteDoc('phonenumbers', phoneNumber.id)
          console.log('DDDDDDD', deletedPhoneNumber)
        })
      )
      const deletedUserAddress = await deleteDoc('useraddresses', userAddress.id)
      console.log('UUUUUUUUU', deletedUserAddress)
    })
  )
  if (!(await deleteDoc('users', selectedUser.id))) return
  console.log(response)
  fetchAllUsers()
  message.value = 'user deleted succesfully'
}

const activateUser = async (userId) => {
  const foundUser = users.value.find((u) => u.id == userId)
  console.log(foundUser)
  if (foundUser) await saveDoc('users', { ...foundUser, active: !foundUser.active })
  // if (response) console.log(response)
  fetchAllUsers()
  // message.value = 'user deleted succesfully'
}

const verifyUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  if (!(await deleteDoc('users', userId))) return
  console.log(response)
  fetchAllUsers()
  message.value = 'user deleted succesfully'
}

await fetchAllUsers()
</script>

<template>
  <div class="p-4">
    <Title>{{ title }}</Title>
    <div class="flex flex-col justify-between gap-4" v-if="totalCount">
      <header class="flex items-center justify-between w-full">
        <h3 class="title">Products</h3>
        <NuxtLink :to="{ name: 'admin-users-id', params: { id: '_' } }">
          <button class="btn btn-primary px-4 py-2 text-xs">
            <IconsPlus class="w-5 h-5 fill-white" />
            <span>Add</span>
          </button>
        </NuxtLink>
      </header>
      <main class="">
        <div class="flex-col gap-3 flex-col br-5">
          <div class="flex-row items-center gap-4" v-if="totalCount">
            <FormsBaseInput name="Per Page" label="Per Page" v-model="perPage" @update:modelValue="setPerPage" />
            <Sort
              :sort="sort"
              :sortOptions="sortOptions"
              @toggleSort="toggleSort"
              v-if="totalCount && users.length > 1"
            />
            <Search class="flex-1" @searchKeywordSelected="handleSearch" v-if="totalCount && users.length > 1" />
          </div>
          <AdminUsersList
            :users="users"
            :totalCount="totalCount"
            @deleteUser="deleteUser"
            @activateUser="activateUser"
            @verifyUser="verifyUser"
          />
        </div>
      </main>
      <footer class="w-full">
        <!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" /> -->
      </footer>
    </div>
    <AdminListFallback v-else>
      <template #header>Add User</template>
      <template #default>
        <div class="">Create your first user</div>
        <NuxtLink
          class="btn btn-primary btn-pill px-4 py-2 text-xs self-end"
          :to="{ name: 'admin-users-id', params: { id: '_' } }"
        >
          <IconsPlus class="fill-white w-5 h-5" />
          <span>Add</span>
        </NuxtLink>
      </template>
    </AdminListFallback>
    <!-- <div class="p-10 flex flex-col gap-2" v-else>
      <h3>Add your first user</h3>
      <NuxtLink
        class="bg-[#0F172A] px-4 py-1 flex text-white items-center gap-2 rounded self-start hover:(text-red-100 bg-[#64748B])"
        :to="{ name: 'admin-users-id', params: { id: '_' } }"
      >
        <IconsPlus class="w-5 h-5 fill-current" />
        <span>Add</span>
      </NuxtLink>
    </div> -->
  </div>
</template>

<style lang="scss" scoped></style>
