<script setup>
defineProps({
  toggleAdminNav: Boolean,
})
// const navLinks = ref([
// { name: 'admin', title: 'Dashboard', icon: 'IconsDashboard', subMenu: [], open: false },
// { name: 'index', title: 'Site', icon: 'IconsHome', subMenu: [], open: false },
// { name: 'admin-media', title: 'Media', icon: 'IconsFolderFill', subMenu: [], open: false },
// { name: 'admin-seeder', title: 'Seeder', icon: 'IconsFolderFill', subMenu: [], open: false },
// { name: 'admin-galleries', title: 'Galleries', icon: 'IconsFolderFill', subMenu: [], open: false },
// {
//   name: 'admin-ecommerce-categories',
//   title: 'Ecommerce',
//   icon: 'IconsCartFill',
//   subMenu: [
//     { name: 'admin-ecommerce-products', title: 'Products', icon: 'IconsCartFill' },
//     { name: 'admin-ecommerce-categories', title: 'Categories', icon: 'IconsClipboard' },
//     { name: 'admin-ecommerce-attributes', title: 'Attributes', icon: 'IconsIdentification' },
//   ],
//   open: false,
// },
// { name: 'admin-users', title: 'Users', icon: 'IconsFolderFill', subMenu: [], open: false },
// ])
</script>

<template>
  <div class="nav p-2 text-sm" :class="{ active: !toggleAdminNav }">
    <NuxtLink
      class="flex items-center gap-4 rounded py-2 transition duration-400 hover:(bg-white text-slate-900)"
      :to="{ name: 'admin' }"
    >
      <IconsHome class="fill-white w-5 h-5 hover:(fill-slate-900)" />
      <div class="scale-50" v-if="toggleAdminNav">Dashboard</div>
    </NuxtLink>
    <NuxtLink
      class="flex items-center gap-4 rounded py-2 transition duration-400 hover:(bg-white text-slate-900)"
      :to="{ name: 'admin-users' }"
    >
      <IconsUser class="fill-white w-5 h-5 hover:(fill-slate-900)" />
      <div class="scale-50" v-if="toggleAdminNav">Users</div>
    </NuxtLink>
    <NuxtLink
      class="flex items-center gap-4 rounded py-2 transition duration-400 hover:(bg-white text-slate-900)"
      :to="{ name: 'admin-users' }"
    >
      <IconsMedia class="fill-white w-5 h-5 hover:(fill-slate-900)" />
      <div class="scale-50" v-if="toggleAdminNav">Media</div>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  &.active {
    a {
      justify-content: center;
    }
  }
}
/* link flex-row justify-between wfull py-1 px-1 uppercase */
/* flex-row justify-between items-center gap-1 */
/* @import '@/assets/scss/variables';

li {
  border-top: 1px solid $slate-400;
  border-bottom: 1px solid $slate-400;
  transition: all 0.2s ease;
  margin-top: -1px;

  &:last-of-type {
    margin-top: 0;
  }
}

.link {
  &:hover {
    background-color: $slate-700;
  }
} */
</style>
