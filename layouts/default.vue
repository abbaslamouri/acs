<script setup>
// const { isAuthenticated } = useAuth()
const loggedInUser = useState('loggedInUser')
const isAuthenticated = useState('isAuthenticated')

// const showCartSlideout = useState('showCart')

// console.log('JWT', useCookie('jwt').value)

// const { showCartSlideout } = useAppState()
</script>

<template>
  <div class="app flex flex-col justidy-between min-h-100vh">
    <header class="sticky top-0 z-9">
      <FreeShipping />
      <div class="bg-white flex items-center justify-between px-4 py-2">
        <!-- <div class="flex items-center justify-between px-4 py-2 border-5"> -->
        <Branding />
        <div class="flex gap-2 items-center">
          <LoginDropdown theme="dark" v-if="!isAuthenticated" />
          <ProfileDropdown theme="dark" v-else />
          <NavCart />
          <!-- </div> -->
        </div>
      </div>
      <nav class="nav">
        <MainNav />
      </nav>
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <footer class="flex items-center justify-center p-2 bg-stone-800 text-slate-50"><Footer /></footer>
  </div>
</template>

<style lang="scss" scoped></style>
