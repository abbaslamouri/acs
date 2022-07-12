<script setup>
const { numberOfItems } = useCart()
const showCartSlideout = useState('showCart')
</script>

<template>
  <div class="border border-gray-400 rounded text-md py-1 px-3">
    <ClientOnly>
      <button
        class="flex flex-row gap-2 items-center"
        :class="{ btn__checkout: numberOfItems() }"
        @click="showCartSlideout = true"
      >
        <IconsCart class="w-5 h-5" />
        <span class="text-xs">Your bag</span>
        <span class="">({{ numberOfItems() }})</span>
      </button>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

button {
  // border: 1px solid $green-900;
  &:hover {
    // border: 1px solid $green-400;

    span {
      // color: $slate-400;
    }

    svg {
      // fill: $slate-800;
    }
  }
}
</style>
