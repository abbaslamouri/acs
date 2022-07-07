<script setup>
defineProps({
  toggleAdminNav: Boolean,
})
</script>

<script>
import IconsHome from '~/components/icons/Home.vue'
import IconsCart from '~/components/icons/Cart.vue'
import IconsUser from '~/components/icons/User.vue'
import IconsMedia from '~/components/icons/Media.vue'

export default {
  components: {
    'icons-home': IconsHome,
    'icons-cart': IconsCart,
    'icons-user': IconsUser,
    'icons-media': IconsMedia,
  },

  data() {
    return {
      navLinks: [
        { name: 'admin', title: 'Dashboard', icon: 'icons-home', subMenu: [], open: false },
        { name: 'admin-products', title: 'Products', icon: 'icons-cart', subMenu: [], open: false },
        { name: 'admin-media', title: 'Media', icon: 'icons-media', subMenu: [], open: false },
        { name: 'admin-users', title: 'Users', icon: 'icons-user', subMenu: [], open: false },
      ],
    }
  },
}
</script>

<template>
  <div class="nav p-2 text-sm" :class="{ active: !toggleAdminNav }">
    <div v-for="(link, index) in navLinks">
      <NuxtLink
        class="flex items-center gap-4 rounded px-3 py-2 transition duration-400 hover:(bg-white text-slate-900)"
        :to="{ name: `${link.name}` }"
        @mouseenter="$event.target.classList.add('hovered')"
        @mouseleave="$event.target.classList.remove('hovered')"
      >
        <component class="fill-white w-5 h-5 hover:(fill-slate-900)" :is="link.icon" />
        <div class="scale-50" v-if="toggleAdminNav">{{ link.title }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  a {
    &.hovered {
      svg {
        fill: #111827;
      }
    }
  }
  &.active {
    a {
      justify-content: center;
    }
  }
}
</style>
