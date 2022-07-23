<script setup>
const props = defineProps({
  users: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteUser', 'activateUser', 'verifyUser'])

const config = useRuntimeConfig()

const router = useRouter()

const showActionKeys = ref([])

const resetActions = () => {
  for (const prop in props.users) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

// const handleEditProduct = (slug) => {
//   resetActions()
//   router.push({ name: 'ecommerce-users-slug', params: { slug } })
// }

const deleteUser = (userId) => {
  emit('deleteUser', userId)
  resetActions()
}
</script>

<template>
  <table class="text-xs shadow-md">
    <thead>
      <tr class="bg-slate-200">
        <th class="w-6">Image</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Verified</th>
        <th>Active</th>
        <th class="text-right min-w-12">actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
        <td class="w-10 flex-row justify-center items-center">
          <div class="w-8 h-8 justify-center items-center">
            <img
              class="w-full h-full cover"
              v-if="
                user.gallery && user.gallery.length && user.gallery[0] && user.gallery[0].mimetype.includes('image')
              "
              :src="`${config.siteUrl}/${user.gallery[0].path}`"
            />
            <img v-else class="w-full hfull contain" :src="`/placeholder.png`" />
          </div>
        </td>
        <td class="w-12 text-center font-bold">{{ user.name }}</td>
        <td class="w-12 text-center">{{ user.email }}</td>
        <td class="w-12 text-center">{{ user.role }}</td>
        <td class="w-12 text-center">
          <!-- <span v-if="user.verified"><IconsCheck class="fill-green-700 w-2 h-2" /></span> -->
        </td>
        <td class="w-12 text-center">
          <!-- <span v-if="user.active"><IconsCheck class="fill-green-700 w-2 h-2" /></span> -->
        </td>
        <td class="w-12">
          <AdminRowActions
            :showAction="showActionKeys[index]"
            :showEdit="true"
            :showActivate="true"
            :showVerify="true"
            :active="user.active"
            @moreHoriz="setActions({ index: index, action: !showActionKeys[index] })"
            @deleteAction="deleteUser(user.id)"
            @editAction="router.push({ name: 'admin-users-id', params: { id: user._id } })"
            @activateAction="$emit('activateUser', user.id)"
            @verifyAction="$emit('verifyUser', user.id)"
            @cancel="resetActions"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
tr {
  // border-bottom: 1px solid $slate-300;
}
th {
  padding: 2rem;
}
td {
  padding: 1rem;

  // border: 1px solid red;
}
</style>
