<script setup>
defineProps({
  toggleAdminNav: Boolean,
})
defineEmits(['toggleAdminNav'])
const config = useRuntimeConfig()
const route = useRoute()
const { fetchAll } = useHttp()
const { isAuthenticated } = useAuth()
const logo = ref('')
// const response = await fetchAll('media', { originalName: 'ACS-Logo-150x45.jpeg' })
// if (response) logo.value = response.docs[0]
</script>

<template>
  <div
    class="branding h-14 flex flex-row justify-between items-center px-2"
    :class="{ active: !toggleAdminNav }"
  >
    <NuxtLink class="" :to="{ name: `index` }" v-if="toggleAdminNav">
      <div class="">ACS</div>
      <!-- <div class="h-4 br-3"> -->
      <!-- <img class="w-full h-full contain" :src="`${config.backendUrl}/${logo.path}`" /> -->
      <!-- </div> -->
    </NuxtLink>
    <IconsMenu class="fill-white cursor-pointer" @click="$emit('toggleAdminNav')" />
  </div>
</template>

<style lang="scss" scoped>
.branding {
  &.active {
    justify-content: center;
  }
}
</style>

<!-- flex-row items-center gap-1 uppercase font-bold h-6 cursor-pointer px-1 text-sm tracking-wide -->
