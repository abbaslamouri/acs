<script setup></script>

<template>
  <div class="app flex-col justidy-between min-h-100vh">
    <header class="sticky top-0 z-9">
      <!-- <FreeShipping /> -->
      <div class="bg-white flex-row items-center justify-center py-1">
        <div class="w-996p flex-row items-center justify-between">
          <Branding />
        </div>
      </div>
    </header>

    <main class="flex-1 flex-col">
      <slot />
    </main>
    <footer class="flex-row items-center justify-center p-2 bg-stone-800 text-slate-50"><Footer /></footer>
  </div>
</template>

<style lang="" scoped>
/* @import '@/assets/scss/variables'; */
</style>
