<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Users | YRL')

// const config = useRuntimeConfig()
// const { errorMsg, message } = useAppState()
// const { fetchAll, fetchDoc, saveDoc, deleteDoc, deleteDocs } = useHttp()

// const users = ref([])
const totalCount = ref(0) // Total item count in the database
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

// const fetchAllUsers = async () => {
//   response = await fetchAll('users', params.value)
//   console.log(response)
//   users.value = response.docs
//   count.value = response.results
//   totalCount.value = response.totalCount
// }

// const handleSearch = async (searchKeyword) => {
//   keyword.value = searchKeyword
//   page.value = 1
//   await fetchAllUsers()
// }

// const toggleSort = async (event) => {
//   sort.field = event.field
//   sort.order = event.order
//   await fetchAllUsers()
// }

// const setPage = async (currentPage) => {
//   page.value = currentPage
//   await fetchAllUsers()
// }

// const setPerPage = async () => {
//   await fetchAllUsers()
// }

// const deleteUser = async (userId) => {
//   if (!confirm('Are you sure you want to delete this user?')) return
//   const selectedUser = users.value.find((u) => u.id == userId)
//   console.log(selectedUser.userAddresses)
//   if (!selectedUser) return
//   await Promise.all(
//     selectedUser.userAddresses.map(async (userAddressId) => {
//       response = await fetchDoc('useraddresses', userAddressId)
//       console.log('UA', response)
//       if (!response || !Object.values(response).length) return
//       const userAddress = response.doc
//       await Promise.all(
//         userAddress.phoneNumbers.map(async (phoneNumber) => {
//           const deletedPhoneNumber = await deleteDoc('phonenumbers', phoneNumber.id)
//           console.log('DDDDDDD', deletedPhoneNumber)
//         })
//       )
//       const deletedUserAddress = await deleteDoc('useraddresses', userAddress.id)
//       console.log('UUUUUUUUU', deletedUserAddress)
//     })
//   )
//   if (!(await deleteDoc('users', selectedUser.id))) return
//   console.log(response)
//   fetchAllUsers()
//   message.value = 'user deleted succesfully'
// }

// const activateUser = async (userId) => {
//   const foundUser = users.value.find((u) => u.id == userId)
//   console.log(foundUser)
//   if (foundUser) await saveDoc('users', { ...foundUser, active: !foundUser.active })
//   // if (response) console.log(response)
//   fetchAllUsers()
//   // message.value = 'user deleted succesfully'
// }

// const verifyUser = async (userId) => {
//   if (!confirm('Are you sure you want to delete this user?')) return
//   if (!(await deleteDoc('users', userId))) return
//   console.log(response)
//   fetchAllUsers()
//   message.value = 'user deleted succesfully'
// }

// await fetchAllUsers()
</script>

<template>
  <div class="flex-1 flex-col p-3">
    <Title>{{ title }}</Title>
    <div class="flex-1 flex-col justify-between gap-3" v-if="totalCount">
      <header class="flex-row items-center justify-between w-full">
        <h3 class="title">Products</h3>
        <!-- <NuxtLink :to="{ name: 'admin-users-id', params: { id: '_' } }">
          <button class="btn btn__primary btn__pill px-2 py-05">
            <IconsPlus />
            <span>Add</span>
          </button>
        </NuxtLink> -->
      </header>
      <main class="flex-1 max-width-130 w-full flex-col gap-3">
        <div class="flex-col gap-3 flex-col br-5">
          <div class="flex-row items-center gap-4" v-if="totalCount">
            <!-- <FormsBaseInput name="Per Page" label="Per Page" v-model="perPage" @update:modelValue="setPerPage" /> -->
            <!-- <Sort
              :sort="sort"
              :sortOptions="sortOptions"
              @toggleSort="toggleSort"
              v-if="totalCount && users.length > 1"
            /> -->
            <!-- <Search class="flex-1" @searchKeywordSelected="handleSearch" v-if="totalCount && users.length > 1" /> -->
          </div>
          <!-- <AdminUsersList
            :users="users"
            :totalCount="totalCount"
            @deleteUser="deleteUser"
            @activateUser="activateUser"
            @verifyUser="verifyUser"
          /> -->
        </div>
      </main>
      <footer class="w-full max-width-130">
        <!-- <Pagination :page="page" :pages="pages" @pageSet="setPage" v-if="pages > 1 && !keyword" /> -->
      </footer>
    </div>
    <AdminListFallback v-else>
      <template #header>Add your first physical or digital product</template>
      <template #default>
        <div class="">Add your product and variants. Products must have at least a name and a price</div>
        <NuxtLink
          class="btn btn__primary btn__pill px-3 py-05 text-xs items-self-end"
          :to="{ name: 'admin-users-id', params: { id: '_' } }"
        >
          <!-- <IconsPlus class="w-2 h-2" /> -->
          <span>Add</span>
        </NuxtLink>
      </template>
    </AdminListFallback>
  </div>
</template>

<style lang="" scoped></style>
