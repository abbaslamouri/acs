<script setup>
const navLinks = ref([
  { name: 'admin', title: 'Dashboard', icon: 'IconsHome', subMenu: [], open: false },
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
])
</script>

<template>
  <ul class="admin-menu text-sm">
    <li v-for="item in navLinks" :key="item.name">
      <div class="link">
        <NuxtLink
          class="link flex-row justify-between wfull py-1 px-1 uppercase"
          :to="{ name: item.subMenu ? `${item.name}` : 'admin' }"
          @click="item.open = !item.open"
        >
          <div class="flex-row justify-between items-center gap-1">
            <component :is="item.icon" class="w-2 h-2 fill-slate-50"></component>
            <p class="text-slate-50">{{ item.title }}</p>
          </div>
          <div class="chevron" v-if="item.subMenu.length > 0">
            <!-- <IconsChevronUp v-if="item.subMenu.length > 0 && item.open" class="w-2 h-2 fill-slate-50" /> -->
            <!-- <IconsChevronDown v-else class="w-2 h-2 fill-slate-50" /> -->
          </div>
        </NuxtLink>
      </div>
      <div v-if="item.subMenu.length > 0 && item.open === true">
        <ul class="admin-sub-menu text-xs">
          <li v-for="subItem in item.subMenu" :key="subItem.name" class="">
            <NuxtLink class="link flex-row items-center gap1 py1 px1 uppercase ml-1" :to="{ name: subItem.name }">
              <component class="w-2 h-2 fill-slate-50" :is="subItem.icon"></component>
              <p class="text-slate-50">{{ subItem.title }}</p>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<style lang="" scoped>
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
