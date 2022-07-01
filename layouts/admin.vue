<script setup>
const { isAuthenticated } = useAuth()
const toggleAdminNav = ref(false)

const checkScreen = () => {
  if (process.client) {
    if (window.innerWidth < 1400) toggleAdminNav.value = false
    if (window.innerWidth >= 1400) toggleAdminNav.value = true
  }
}

if (process.client) {
  window.addEventListener('resize', checkScreen)
  checkScreen()
}
</script>

<template>
  <div class="flex flex-row min-h-[100vh]">
    <aside class="w-[240px] bg-slate-900 text-white transition duration-400" :class="{ active: !toggleAdminNav }">
      <Branding :toggleAdminNav="toggleAdminNav" @toggleAdminNav="toggleAdminNav = !toggleAdminNav" />
      <AdminNav :toggleAdminNav="toggleAdminNav" />
    </aside>
    <main class="flex-1 flex flex-col">
      <header class="h-14 px-10 py-2 bg-stone-800 flex justify-end items-center text-sm">
        <LoginDropdown v-if="!isAuthenticated" />
        <ProfileDropdown v-else />
      </header>
      <div class="flex-1 border border-green-900">
        <slot />
      </div>
      <footer class=""><AdminFooter /></footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.active {
  width: 80px;
}

.admin-nav-enter-from,
.admin-nav-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.admin-nav-enter-to,
.admin-nav-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.admin-nav-enter-active,
.admin-nav-leave-active {
  transition: all 5s ease;
}
</style>
