<script setup>
const { isAuthenticated } = useAuth()
const showAdminSidebar = ref(false)

const checkScreen = () => {
  if (process.client) {
    if (window.innerWidth < 1400) showAdminSidebar.value = false
    if (window.innerWidth >= 1400) showAdminSidebar.value = true
  }
}

if (process.client) {
  window.addEventListener('resize', checkScreen)
  checkScreen()
}
</script>

<template>
  <div class="app admin flex-row">
    <transition name="admin-nav">
      <aside class="bg-slate-900" v-show="showAdminSidebar">
        <!-- <Branding /> -->
        <AdminNav />
      </aside>
    </transition>
    <main :class="{ 'h-full': !showAdminSidebar }">
      <header class="flex-row items-center justify-between px-2 py-2 text-slate-50">
        <!-- <MobileNavToggler @hideAdminSidebar="showAdminSidebar = !showAdminSidebar" /> -->
        <div class="bg-slate-50">
          <!-- <LoginDropdown v-if="!isAuthenticated" /> -->
          <!-- <ProfileDropdown v-else /> -->
        </div>
      </header>
      <div class="content">
        <slot />
      </div>
      <footer class=""><AdminFooter /></footer>
    </main>
  </div>
</template>

<style lang="" scoped>
/* @import '@/assets/scss/variables';

.app.admin {
	aside {
		position: sticky;
		top: 0;
		height: 100vh;
		transition: all 0.2s ease-in-out;
		min-width: 25rem;
	}

	main {
		flex: 1;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		height: 100vh;

		justify-content: space-between;
		header {
			position: sticky;
			top: 0;
			height: 6rem;
			background-color: $stone-900;
			z-index: 1;
			border: 3px solid red;
		}

		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			min-height: 90vh;
			width: 100%;
			background-color: $slate-100;
			border: 10px solid yellow;
			display: flex;
		}

		footer {
			background-color: $stone-900;
			height: 6rem;
			border: 3px solid red;
		}
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
		transition: all 0.2s ease;
	}
} */
</style>
