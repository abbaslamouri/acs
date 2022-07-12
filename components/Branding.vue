<script setup>
defineProps({
  toggleAdminNav: Boolean,
})
defineEmits(['toggleAdminNav'])
const route = useRoute()
// console.log(route)
</script>

<template>
  <div class="">
    <div class="flex flex-row justify-between items-center p-2" v-if="route.name.includes('admin')">
      <NuxtLink class="w-24" :to="{ name: `index` }">
        <div class="" v-if="toggleAdminNav">ACS</div>
      </NuxtLink>
      <IconsMenu
        class="fill-white cursor-pointer"
        @click="$emit('toggleAdminNav')"
        v-if="route.name.includes('admin')"
      />
    </div>
    <div v-else>
      <NuxtLink class="w-24" :to="{ name: `index` }">
        <img class="w-full h-full object-contain" src="/acs-logo.jpeg" />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
